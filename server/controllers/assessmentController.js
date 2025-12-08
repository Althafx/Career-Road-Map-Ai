const Assessment = require('../models/Assessment');

exports.createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create({
      user: req.user.id,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      assessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ user: req.user.id });
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};