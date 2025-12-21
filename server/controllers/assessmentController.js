const User = require('../models/User');
const Roadmap = require('../models/Roadmap');

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
    // We need to fetch assessments AND their corresponding roadmaps to know the status
    const user = await User.findById(req.user.id);
    const assessments = user.assessments || [];

    // Fetch roadmaps for all assessments
    const roadmaps = await Roadmap.find({
      user: req.user.id,
      assessmentId: { $in: assessments.map(a => a._id.toString()) }
    });

    // Merge roadmap status into assessment objects
    const enrichedAssessments = assessments.map(assessment => {
      const roadmap = roadmaps.find(r => r.assessmentId === assessment._id.toString());

      let progressPercentage = 0;
      let totalTasks = 0;
      let completedTasksCount = 0;

      if (roadmap && roadmap.roadmapContent) {
        try {
          const parsedContent = JSON.parse(roadmap.roadmapContent);
          // Calculate total tasks (sum of skills in all phases)
          if (parsedContent.phases && Array.isArray(parsedContent.phases)) {
            totalTasks = parsedContent.phases.reduce((acc, phase) => {
              return acc + (phase.skills ? phase.skills.length : 0);
            }, 0);
          }

          completedTasksCount = roadmap.progress ? roadmap.progress.completedTasks.length : 0;

          if (totalTasks > 0) {
            progressPercentage = Math.round((completedTasksCount / totalTasks) * 100);
          }
          // Cap at 100% just in case
          if (progressPercentage > 100) progressPercentage = 100;

          // If marked as completed in DB, ensure it shows 100%
          if (roadmap.progress?.isCompleted) progressPercentage = 100;

        } catch (e) {
          console.error('Error parsing roadmap content for progress:', e);
        }
      }

      return {
        ...assessment.toObject(),
        hasRoadmap: !!roadmap,
        roadmapStatus: roadmap?.status,
        roadmapCompleted: roadmap?.progress?.isCompleted || false,
        roadmapProgress: completedTasksCount,
        totalTasks: totalTasks,
        progressPercentage: progressPercentage
      };
    });

    res.json({ success: true, assessments: enrichedAssessments });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Also delete linked roadmap
    await Roadmap.findOneAndDelete({
      user: req.user.id,
      assessmentId: req.params.id
    });

    user.assessments = user.assessments.filter(
      a => a._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ success: true, message: 'Assessment and Roadmap deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};