const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');

const getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user.id; // From requireAuth middleware

        // Fetch basic stats
        const attempts = await TestAttempt.find({ user_id: userId }).populate('test_id');

        let totalScore = 0;
        let totalPossibleScore = 0;
        let subjectMastery = {};
        const recentTests = [];

        // Fetch all questions to match answers to subjects easily (if needed) - but wait, attempt.answers only have question_id and concept_tag, not subject!
        // We need to fetch questions for the user's answers to get the subject because current attempt.answers lacks it.
        // Let's gather all question_ids
        let questionIds = [];
        attempts.forEach(attempt => {
            if (attempt.status === 'Completed') {
                attempt.answers.forEach(ans => questionIds.push(ans.question_id));
            }
        });

        // Map question ID to subject
        const questions = await Question.find({ _id: { $in: questionIds } });
        const questionSubjectMap = {};
        questions.forEach(q => {
            questionSubjectMap[q._id.toString()] = q.subject;
        });

        attempts.forEach(attempt => {
            if (attempt.status === 'Completed') {
                totalScore += attempt.score;
                totalPossibleScore += attempt.answers.length;

                attempt.answers.forEach(ans => {
                    const subject = questionSubjectMap[ans.question_id.toString()] || 'General';
                    if (!subjectMastery[subject]) {
                        subjectMastery[subject] = { correct: 0, total: 0 };
                    }
                    subjectMastery[subject].total += 1;
                    if (ans.is_correct) subjectMastery[subject].correct += 1;
                });

                recentTests.push({
                    testTitle: attempt.test_id?.title || 'Unknown Test',
                    score: attempt.score,
                    accuracy: attempt.accuracy_percentage,
                    date: attempt.start_time
                });
            }
        });

        const subjectScores = {};
        for (const [subj, data] of Object.entries(subjectMastery)) {
            subjectScores[subj] = data.total > 0 ? (data.correct / data.total) * 100 : 0;
        }

        const overallAccuracy = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

        // Fetch available mock tests
        const availableTests = await Test.find({ is_active: true });

        res.json({
            success: true,
            dashboard: {
                totalTestsTaken: attempts.filter(a => a.status === 'Completed').length,
                overallAccuracy: overallAccuracy.toFixed(2),
                recentActivity: recentTests.sort((a, b) => b.date - a.date).slice(0, 5),
                availableTests: availableTests,
                subjectMastery: subjectScores,
                userProfile: {
                    name: req.user.name,
                    email: req.user.email,
                    profile_picture: req.user.profile_picture || ''
                }
            }
        });

    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profile_picture, name } = req.body;

        const updateData = {};
        if (profile_picture !== undefined) updateData.profile_picture = profile_picture;
        if (name !== undefined) updateData.name = name;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, select: '-password_hash' }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const topStudents = await User.find({ role: 'Student' })
            .select('name profile_picture overall_accuracy tests_taken')
            .sort({ overall_accuracy: -1, tests_taken: -1 })
            .limit(10);

        res.json({
            success: true,
            leaderboard: topStudents
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getStudentDashboard,
    updateProfile,
    getLeaderboard
};
