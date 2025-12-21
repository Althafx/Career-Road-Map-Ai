const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'playlist', 'documentation', 'course', 'article', 'github'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    duration: {
        type: String, // "2 hours", "10 videos", etc.
    },
    skills: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    thumbnail: {
        type: String
    },
    author: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster skill-based queries
resourceSchema.index({ skills: 1 });
resourceSchema.index({ type: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
