const mongoose = require('mongoose');


const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentRole: String,
  yearsOfExperience: Number,
  targetRole: String,
  skills: [String],
  interests: [String],
  educationLevel: String,
  preferredLearningStyle: String,
  timeCommitment: String, // hours per week
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Assessment', assessmentSchema);