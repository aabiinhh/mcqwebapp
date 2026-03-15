const express = require('express');
const router = express.Router();
const { getStudentsMarks } = require('../controllers/facultyController');
const { protect } = require('../middleware/auth');

// Middleware to ensure user is faculty
const facultyRequired = (req, res, next) => {
    if (req.user && req.user.role === 'Faculty') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden. Faculty credentials required.' });
    }
};

router.get('/students/marks', protect, facultyRequired, getStudentsMarks);

module.exports = router;
