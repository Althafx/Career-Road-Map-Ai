const User = require('../models/User');

exports.createAssessment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Add new assessment to array
    user.assessments.push({
      ...req.body,
      createdAt: new Date()
    });

    await user.save();

    const newAssessment = user.assessments[user.assessments.length - 1];

    res.status(201).json({
      success: true,
      assessment: newAssessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, assessments: user.assessments || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.assessments = user.assessments.filter(
      a => a._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ success: true, message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};