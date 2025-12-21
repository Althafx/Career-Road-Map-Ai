const mongoose = require('mongoose');
const roadmapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessmentId: {
        type: String,
        required: true
    },
    careerAdvice: {
        type: String
    },
    roadmapContent: {
        type: String
    },
    status: {
        type: String,
        enum: ['generating', 'completed', 'failed'],
        default: 'generating'
    },
    progress: {
        currentPhase: {
            type: Number,
            default: 0
        },
        completedTasks: [{
            phaseIndex: Number,
            taskIndex: Number,
            completed: Boolean
        }],
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Roadmap', roadmapSchema);