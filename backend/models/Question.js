const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    options: [{
        id: { type: String, required: true },
        text: { type: String, required: true }
    }],
    correct_option: { type: String, required: true },
    explanation: { type: String, default: "No detailed explanation provided for this question." },

    // Categorization
    subject: { type: String, required: true },
    concept_tag: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },

    // Analytics and Governance
    is_active: { type: Boolean, default: true },
    historical_accuracy: { type: Number, default: 0 },
    times_attempted: { type: Number, default: 0 },
    times_correct: { type: Number, default: 0 },

    // For strict logging
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
