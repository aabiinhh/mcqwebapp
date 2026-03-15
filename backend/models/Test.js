const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },

    // Strict Limits
    total_duration_minutes: { type: Number, required: true },
    time_per_question_seconds: { type: Number, default: 0 }, // 0 means no strict per-question limit, just overall

    // Selection Logic
    subject: { type: String, required: true },
    is_adaptive: { type: Boolean, default: true },

    // Test Lifecycle
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
