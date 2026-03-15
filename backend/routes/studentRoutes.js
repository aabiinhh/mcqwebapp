const express = require('express');
const router = express.Router();
const { getStudentDashboard, updateProfile, getLeaderboard } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getStudentDashboard);
router.get('/leaderboard', protect, getLeaderboard);
router.put('/profile', protect, updateProfile);

module.exports = router;
