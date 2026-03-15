const TestAttempt = require('../models/TestAttempt');
const User = require('../models/User');

const getStudentsMarks = async (req, res) => {
    try {
        // Find all student attempts
        // In a more complex app, we might filter by the faculty's specific assigned classes/subjects.
        // For now, fetch all completed tests by students.

        const attempts = await TestAttempt.find({ status: 'Completed' })
            .populate('user_id', 'name email')
            .populate('test_id', 'title subject');

        const marksData = attempts.map(attempt => {
            return {
                attemptId: attempt._id,
                studentName: attempt.user_id ? attempt.user_id.name : 'Unknown',
                studentEmail: attempt.user_id ? attempt.user_id.email : 'Unknown',
                testTitle: attempt.test_id ? attempt.test_id.title : 'Unknown Test',
                subject: attempt.test_id ? attempt.test_id.subject : 'Unknown',
                score: attempt.score,
                accuracy: attempt.accuracy_percentage,
                date: attempt.end_time || attempt.start_time
            };
        });

        res.json({
            success: true,
            marks: marksData
        });

    } catch (error) {
        console.error('Error fetching students marks:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getStudentsMarks
};
