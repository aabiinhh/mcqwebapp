const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Admin', 'Faculty'], default: 'Student' },

    // Faculty specific
    facultyId: { type: String, unique: true, sparse: true },

    // Student specific
    profile_picture: { type: String, default: '' },

    // Analytics tracking across the platform
    overall_accuracy: { type: Number, default: 0 },
    tests_taken: { type: Number, default: 0 },
    readiness_status: { type: String, enum: ['Not exam-ready', 'Borderline', 'Exam-ready'], default: 'Not exam-ready' },

    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
