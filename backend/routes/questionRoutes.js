const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions, archiveQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect, adminOrFacultyRequired } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Temporary storage for CSV files

router.post('/', protect, adminOrFacultyRequired, addQuestion);
router.post('/bulk', protect, adminOrFacultyRequired, upload.single('file'), require('../controllers/questionController').bulkImportQuestions);
router.get('/', protect, adminOrFacultyRequired, getQuestions);
router.put('/:id', protect, adminOrFacultyRequired, updateQuestion);
router.delete('/:id', protect, adminOrFacultyRequired, deleteQuestion);
router.put('/:id/archive', protect, adminOrFacultyRequired, archiveQuestion);

module.exports = router;
