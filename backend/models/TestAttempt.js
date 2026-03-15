const mongoose = require('mongoose');

// Subdocument for tracking each question attempt strictly
const answerLogSchema = new mongoose.Schema({
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    concept_tag: { type: String, required: true }, // Snapshotted for analytics speed
    difficulty: { type: String, required: true }, // Snapshotted

    // Performance Data
    selected_option_id: { type: String }, // Null means skipped/timed out
    is_correct: { type: Boolean, default: false },
    time_spent_seconds: { type: Number, required: true },

    // Mistake Classification (Populated later by analytics engine)
    mistake_type: { type: String, enum: ['Conceptual', 'Calculation', 'Guessing', 'Time Pressure', 'None'], default: 'None' },

    // Lock Mechanism
    is_locked: { type: Boolean, default: true }, // Once recorded, it NEVER unlocks
    answered_at: { type: Date, default: Date.now }
});

const testAttemptSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },

    // Strict Server Timers
    start_time: { type: Date, required: true, default: Date.now },
    end_time: { type: Date }, // Will be set when test is finished or time expires

    // Security & Integrity
    tab_switches: { type: Number, default: 0 },
    idle_warnings: { type: Number, default: 0 },
    is_invalidated: { type: Boolean, default: false }, // True if caught cheating

    // State Management
    status: { type: String, enum: ['In Progress', 'Completed', 'Invalidated'], default: 'In Progress' },
    current_question_index: { type: Number, default: 0 }, // For backward compatibility
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Static array of questions selected for this attempt

    // The Logs
    answers: [answerLogSchema],

    // Final Analytics (Populated on Complete)
    score: { type: Number, default: 0 },
    accuracy_percentage: { type: Number, default: 0 }
});



module.exports = mongoose.model('TestAttempt', testAttemptSchema);
