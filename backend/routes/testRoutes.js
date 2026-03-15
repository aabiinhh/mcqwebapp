const express = require('express');
const router = express.Router();
const { startTest, fetchAllQuestions, syncAnswers, finishTest, createTest, getAllTests } = require('../controllers/testController');
const { protect, adminRequired } = require('../middleware/auth');

router.post('/', protect, adminRequired, createTest);
router.get('/', protect, getAllTests); // All authenticated users can potentially view tests

router.post('/:id/start', protect, startTest);
router.get('/attempt/:attemptId/questions', protect, fetchAllQuestions);
router.post('/attempt/:attemptId/sync', protect, syncAnswers);
router.post('/attempt/:attemptId/finish', protect, finishTest);

module.exports = router;
