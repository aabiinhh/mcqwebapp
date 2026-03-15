const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const Question = require('../models/Question');
const { runPostExamAnalytics } = require('../services/analyticsEngine');

// @desc    Start test and initialize server timer
// @route   POST /api/tests/:id/start
// @access  Private
const startTest = async (req, res) => {
    try {
        const testId = req.params.id;
        const userId = req.user.id; // from Auth middleware

        const test = await Test.findById(testId);
        if (!test || !test.is_active) {
            return res.status(404).json({ success: false, message: 'Test not found or inactive' });
        }

        // Check if an IN PROGRESS attempt already exists
        let attempt = await TestAttempt.findOne({ user_id: userId, test_id: testId, status: 'In Progress' });

        if (attempt) {
            // Resume test if time remains
            const now = new Date();
            const elapsedMinutes = (now - attempt.start_time) / 60000;
            if (elapsedMinutes >= test.total_duration_minutes) {
                // Time is up, force finish
                attempt.status = 'Completed';
                attempt.end_time = now;
                await attempt.save();
                return res.status(400).json({ success: false, message: 'Time expired for this test attempt. Please start a new attempt.' });
            }
        } else {
            // Pre-fetch questions for this attempt to support bi-directional navigation
            let matchQuery = { is_active: true };
            if (test.subject !== 'Comprehensive') {
                const subjectRegex = test.subject.split(/, | and /).map(s => `(${s})`).join('|');
                matchQuery.subject = { $regex: subjectRegex, $options: 'i' };
            }
            const matchedQuestions = await Question.find(matchQuery).select('_id');
            // Shuffle
            const shuffledIds = matchedQuestions.map(q => q._id).sort(() => 0.5 - Math.random());

            attempt = await TestAttempt.create({
                user_id: userId,
                test_id: testId,
                start_time: new Date(),
                status: 'In Progress',
                current_question_index: 0,
                questions: shuffledIds,
                answers: []
            });
        }

        res.status(200).json({ success: true, attempt_id: attempt._id, start_time: attempt.start_time, duration: test.total_duration_minutes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error starting test' });
    }
};

// @desc    Fetch ALL questions for the attempt
// @route   GET /api/tests/attempt/:attemptId/questions
// @access  Private
const fetchAllQuestions = async (req, res) => {
    try {
        const attempt = await TestAttempt.findById(req.params.attemptId).populate({
            path: 'questions',
            select: '_id question_text options subject',
        });

        if (!attempt || attempt.user_id.toString() !== req.user.id || attempt.status !== 'In Progress') {
            return res.status(403).json({ success: false, message: 'Invalid or unauthorized attempt' });
        }

        const test = await Test.findById(attempt.test_id);

        const elapsedMinutes = (new Date() - attempt.start_time) / 60000;
        if (elapsedMinutes >= test.total_duration_minutes) {
            attempt.status = 'Completed';
            attempt.end_time = new Date();
            await attempt.save();
            return res.status(400).json({ success: false, message: 'Time expired' });
        }

        // Return the full array of questions (stripped of correct_option) and shuffle options
        const safeQuestions = attempt.questions.map(q => {
            // Shuffle options
            const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());

            return {
                id: q._id,
                text: q.question_text,
                options: shuffledOptions,
                subject: q.subject
            };
        });

        res.status(200).json({
            success: true,
            questions: safeQuestions,
            // also return previously locked answers from DB or let frontend manage via Local Storage
            answers: attempt.answers
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error fetching questions' });
    }
};

// @desc    Sync multiple answers at once to support flexible navigation/local storage
// @route   POST /api/tests/attempt/:attemptId/sync
// @access  Private
const syncAnswers = async (req, res) => {
    try {
        const { answers } = req.body; // array of { question_id, selected_option_id, time_spent_seconds }
        const attempt = await TestAttempt.findById(req.params.attemptId);

        if (!attempt || attempt.status !== 'In Progress') {
            return res.status(403).json({ success: false, message: 'Test not active' });
        }

        // Batch fetch questions to check correct_option
        const questionIds = Object.keys(answers);
        const questions = await Question.find({ _id: { $in: questionIds } });
        const questionMap = {};
        questions.forEach(q => questionMap[q._id.toString()] = q);

        attempt.answers = []; // Reset and rebuild to easily allow clearing/changing

        for (const [qId, ansData] of Object.entries(answers)) {
            const question = questionMap[qId];
            if (!question) continue;

            // Optional Clear mechanism: If ansData.selectedOption is null, treat as unanswered
            const is_correct = question.correct_option === ansData.selectedOption;
            let mistake_type = 'None';
            if (!is_correct && ansData.selectedOption) {
                if (ansData.timeSpent < 10) mistake_type = 'Guessing';
                else mistake_type = 'Conceptual';
            }

            attempt.answers.push({
                question_id: qId,
                concept_tag: question.concept_tag,
                difficulty: question.difficulty,
                selected_option_id: ansData.selectedOption || null, // null means cleared choice
                is_correct: ansData.selectedOption ? is_correct : false,
                time_spent_seconds: ansData.timeSpent || 0,
                mistake_type: ansData.selectedOption ? mistake_type : 'Time Pressure',
                is_locked: false // no longer locked per question
            });
        }

        await attempt.save();
        res.status(200).json({ success: true, message: 'Answers synchronized' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error syncing answers' });
    }
}

// @desc    Finish test completely manually
// @route   POST /api/tests/attempt/:attemptId/finish
// @access  Private
const finishTest = async (req, res) => {
    try {
        const attempt = await TestAttempt.findById(req.params.attemptId).populate('test_id');
        if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
        if (attempt.status === 'Completed') return res.status(400).json({ success: false, message: 'Already completed' });

        const test = attempt.test_id;

        // Auto-evaluate missing questions as incorrect (Unanswered)
        if (test && !test.is_adaptive) {
            const answeredIds = attempt.answers.map(a => a.question_id);
            let matchQuery = { is_active: true, _id: { $nin: answeredIds } };

            if (test.subject !== 'Comprehensive') {
                const subjectRegex = test.subject.split(/, | and /).map(s => `(${s})`).join('|');
                matchQuery.subject = { $regex: subjectRegex, $options: 'i' };
            }

            const missingQuestions = await Question.find(matchQuery);

            missingQuestions.forEach(q => {
                attempt.answers.push({
                    question_id: q._id,
                    concept_tag: q.concept_tag,
                    difficulty: q.difficulty,
                    selected_option_id: null,
                    is_correct: false,
                    time_spent_seconds: 0,
                    mistake_type: 'Time Pressure',
                    is_locked: true
                });
            });
            attempt.current_question_index += missingQuestions.length;
        }

        attempt.status = 'Completed';
        attempt.end_time = new Date();

        // Execute Brutal Analytics Engine
        const analyticsResult = await runPostExamAnalytics(attempt);

        // Populate detailed answers for the conclusion screen
        await attempt.populate('answers.question_id', 'question_text options correct_option explanation subject concept_tag');

        const detailedResults = attempt.answers.map(ans => {
            const q = ans.question_id; // the populated question doc
            return {
                question_text: q ? q.question_text : "Question not found",
                options: q ? q.options : [],
                selected_option: ans.selected_option_id,
                correct_option: q ? q.correct_option : null,
                is_correct: ans.is_correct,
                explanation: q ? q.explanation : "No explanation available.",
                subject: q ? q.subject : "General",
                time_spent_seconds: ans.time_spent_seconds
            };
        });

        res.status(200).json({
            success: true,
            message: 'Test Finished',
            analytics: analyticsResult,
            detailedResults: detailedResults
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private/Admin
const createTest = async (req, res) => {
    try {
        const { title, description, total_duration_minutes, time_per_question_seconds, subject, is_adaptive } = req.body;

        if (!title || !total_duration_minutes || !subject) {
            return res.status(400).json({ success: false, message: 'Title, duration, and subject are required' });
        }

        const test = await Test.create({
            title,
            description,
            total_duration_minutes,
            time_per_question_seconds: time_per_question_seconds || 0,
            subject,
            is_adaptive: is_adaptive !== undefined ? is_adaptive : true,
            is_active: false // Tests start as inactive until questions are added/verified
        });

        res.status(201).json({ success: true, test });
    } catch (error) {
        console.error("Create Test Error:", error);
        res.status(500).json({ success: false, message: 'Server error creating test' });
    }
};

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ created_at: -1 });
        res.status(200).json({ success: true, count: tests.length, tests });
    } catch (error) {
        console.error("Get All Tests Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching tests' });
    }
};

module.exports = { startTest, fetchAllQuestions, syncAnswers, finishTest, createTest, getAllTests };
