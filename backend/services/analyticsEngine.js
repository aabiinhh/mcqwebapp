const User = require('../models/User');
const Question = require('../models/Question');

/**
 * Brutal Analytics Engine
 * Runs upon Exam Completion to classify mistakes, recalculate question difficulty matrix,
 * and assign severe Readiness rankings. Sugarcoating is strictly disabled.
 */
const runPostExamAnalytics = async (attempt) => {
    try {
        let totalTimeSpent = 0;
        let conceptualErrors = 0;
        let guessingErrors = 0;
        let timePressureErrors = 0;

        // 1. Traverse every logged answer to classify mistakes and track Question health
        for (let ans of attempt.answers) {
            totalTimeSpent += ans.time_spent_seconds;

            // Mistake Classification Matrix
            if (!ans.is_correct) {
                if (ans.time_spent_seconds < 10) {
                    ans.mistake_type = 'Guessing';
                    guessingErrors++;
                } else if (ans.time_spent_seconds > 60) {
                    ans.mistake_type = 'Conceptual';
                    conceptualErrors++;
                } else {
                    ans.mistake_type = 'Calculation'; // Standard error
                }

                // If time expired on this question
                if (!ans.selected_option_id) {
                    ans.mistake_type = 'Time Pressure';
                    timePressureErrors++;
                }
            }

            // Update Question Historical Accuracy Matrix directly
            const questionRecord = await Question.findById(ans.question_id);
            if (questionRecord) {
                questionRecord.times_attempted += 1;
                if (ans.is_correct) questionRecord.times_correct += 1;
                questionRecord.historical_accuracy = (questionRecord.times_correct / questionRecord.times_attempted) * 100;

                // Automated Question Difficulty Indexing
                if (questionRecord.times_attempted >= 5) { // Ensure enough sample size before changing difficulty
                    if (questionRecord.historical_accuracy >= 70) {
                        questionRecord.difficulty = 'Easy';
                    } else if (questionRecord.historical_accuracy <= 40) {
                        questionRecord.difficulty = 'Hard';
                    } else {
                        questionRecord.difficulty = 'Medium';
                    }
                }

                await questionRecord.save();
            }
        }

        // 2. Assign Output Metrics to Attempt
        const totalAnswers = attempt.answers.length;
        const correctAnswers = attempt.answers.filter(a => a.is_correct).length;

        attempt.score = correctAnswers;
        attempt.accuracy_percentage = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
        const avgTimePerQuestion = totalAnswers > 0 ? (totalTimeSpent / totalAnswers) : 0;

        // 3. User Readiness Classification Matrix
        const user = await User.findById(attempt.user_id);
        if (user) {
            user.tests_taken += 1;

            // Rolling Accuracy Update (Weighted averge logic can be applied later, using simple gross average now for strictness)
            user.overall_accuracy = ((user.overall_accuracy * (user.tests_taken - 1)) + attempt.accuracy_percentage) / user.tests_taken;

            // Strict Readiness Logic
            if (user.overall_accuracy >= 75 && conceptualErrors === 0) {
                user.readiness_status = 'Exam-ready';
            } else if (user.overall_accuracy >= 50 && guessingErrors < 3) {
                user.readiness_status = 'Borderline';
            } else {
                user.readiness_status = 'Not exam-ready';
            }

            await user.save();
        }

        // Save Attempt with finalized Analytics
        await attempt.save();

        return {
            accuracy: attempt.accuracy_percentage,
            score: correctAnswers,
            total_questions: totalAnswers,
            readiness: user ? user.readiness_status : 'Unknown',
            breakdown: {
                conceptual: conceptualErrors,
                guessing: guessingErrors,
                time_pressure: timePressureErrors,
                avg_time: avgTimePerQuestion
            }
        };

    } catch (err) {
        console.error("Critical Analytics Engine Failure:", err);
    }
};

module.exports = { runPostExamAnalytics };
