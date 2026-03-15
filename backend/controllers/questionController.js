const Question = require('../models/Question');
const fs = require('fs');
const csv = require('csv-parser');

// @desc    Add a new question
// @route   POST /api/questions
// @access  Private/Admin
const addQuestion = async (req, res) => {
    try {
        const { question_text, options, correct_option, subject, concept_tag, difficulty } = req.body;

        // Strict Validation
        if (!question_text || !options || options.length < 2 || !correct_option || !subject || !concept_tag || !difficulty) {
            return res.status(400).json({ success: false, message: 'All fields are required. Minimum 2 options.' });
        }

        // Validate correct_option exists in options array
        const optionExists = options.find(opt => opt.id === correct_option);
        if (!optionExists) {
            return res.status(400).json({ success: false, message: 'Correct option must match one of the provided option IDs.' });
        }

        const question = await Question.create({
            question_text,
            options,
            correct_option,
            subject,
            concept_tag,
            difficulty,
            is_active: true
        });

        res.status(201).json({ success: true, question });
    } catch (error) {
        console.error("Add Question Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all questions (with filtering for analytics)
// @route   GET /api/questions
// @access  Private/Admin
const getQuestions = async (req, res) => {
    try {
        // Optional filters
        const { subject, difficulty, is_active } = req.query;
        let query = {};

        if (subject) query.subject = subject;
        if (difficulty) query.difficulty = difficulty;
        if (is_active !== undefined) query.is_active = is_active === 'true';

        const questions = await Question.find(query).sort({ created_at: -1 });

        // Add dynamically calculated warning flags for the dashboard
        const enrichedQuestions = questions.map(q => {
            const doc = q.toObject();
            // Flag if highly attempted but < 40% accuracy
            if (doc.times_attempted > 5 && doc.historical_accuracy < 40) {
                doc.warning_flag = 'High Failure Rate';
            }
            return doc;
        });

        res.status(200).json({ success: true, count: enrichedQuestions.length, questions: enrichedQuestions });
    } catch (error) {
        console.error("Get Questions Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Archive (Soft Delete) a flawed question
// @route   PUT /api/questions/:id/archive
// @access  Private/Admin
const archiveQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        question.is_active = false;
        await question.save();

        res.status(200).json({ success: true, message: 'Question archived (disabled)' });
    } catch (error) {
        console.error("Archive Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin/Faculty
const updateQuestion = async (req, res) => {
    try {
        const { question_text, options, correct_option, subject, concept_tag, difficulty } = req.body;

        let question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        if (options && correct_option) {
            const optionExists = options.find(opt => opt.id === correct_option);
            if (!optionExists) {
                return res.status(400).json({ success: false, message: 'Correct option must exist in the options array.' });
            }
        }

        question.question_text = question_text || question.question_text;
        question.options = options || question.options;
        question.correct_option = correct_option || question.correct_option;
        question.subject = subject || question.subject;
        question.concept_tag = concept_tag || question.concept_tag;
        question.difficulty = difficulty || question.difficulty;

        await question.save();
        res.status(200).json({ success: true, question });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a question completely
// @route   DELETE /api/questions/:id
// @access  Private/Admin/Faculty
const deleteQuestion = async (req, res) => {
    try {
        const result = await Question.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, message: 'Question deleted permanently' });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// @desc    Bulk Import via CSV
// @route   POST /api/questions/bulk
// @access  Private/Admin/Faculty
const bulkImportQuestions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
        }

        const results = [];
        const errors = [];
        let rowCount = 0;

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                rowCount++;
                try {
                    // Expected CSV format Headers:
                    // Question Text, Option A, Option B, Option C, Option D, Correct Option, Subject, Concept Tag, Difficulty
                    const question_text = data['Question Text']?.trim();
                    const correct_option = data['Correct Option']?.trim().toUpperCase();
                    const subject = data['Subject']?.trim();
                    const concept_tag = data['Concept Tag']?.trim();
                    const difficulty = data['Difficulty']?.trim() || 'Medium';

                    const options = [
                        { id: 'A', text: data['Option A']?.trim() },
                        { id: 'B', text: data['Option B']?.trim() },
                        { id: 'C', text: data['Option C']?.trim() },
                        { id: 'D', text: data['Option D']?.trim() }
                    ].filter(opt => opt.text); // keep only non-empty options

                    if (!question_text || options.length < 2 || !correct_option || !subject || !concept_tag) {
                        errors.push(`Row ${rowCount}: Missing required fields or insufficient options.`);
                        return;
                    }

                    if (!['A', 'B', 'C', 'D'].includes(correct_option) || !options.find(o => o.id === correct_option)) {
                        errors.push(`Row ${rowCount}: Invalid Correct Option ID.`);
                        return;
                    }

                    results.push({
                        question_text,
                        options,
                        correct_option,
                        subject,
                        concept_tag,
                        difficulty: ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium',
                        is_active: true
                    });
                } catch (e) {
                    errors.push(`Row ${rowCount}: Malformed data.`);
                }
            })
            .on('end', async () => {
                try {
                    // Delete temp file
                    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

                    if (results.length > 0) {
                        await Question.insertMany(results);
                    }

                    res.status(200).json({
                        success: true,
                        message: `Bulk import completed. Inserted ${results.length} questions.`,
                        errors: errors.length > 0 ? errors : undefined
                    });
                } catch (insertError) {
                    console.error("CSV Insert Error", insertError);
                    res.status(500).json({ success: false, message: 'Database error while inserting questions.' });
                }
            })
            .on('error', (err) => {
                console.error("CSV Parse Error", err);
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                res.status(500).json({ success: false, message: 'Error parsing CSV file.' });
            });

    } catch (error) {
        console.error("Bulk Import Error:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: 'Server Error during bulk import' });
    }
};

module.exports = { addQuestion, getQuestions, archiveQuestion, updateQuestion, deleteQuestion, bulkImportQuestions };
