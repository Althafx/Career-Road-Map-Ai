const Roadmap = require('../models/Roadmap');
const Assessment = require('../models/Assessment');
const { generateCareerAdvice, generateRoadmap } = require('../services/aiService');


exports.generateUserRoadmap = async (req, res) => {
    let roadmap; // Declare outside try block
    try {
        const assessment = await Assessment.findOne({ user: req.user.id })
        if (!assessment) {
            return res.status(404).json({ message: "please complete the career assessment first" })
        }

        roadmap = await Roadmap.findOne({ user: req.user.id })
        if (roadmap && roadmap.status === "completed") {
            return res.status(200).json({ success: true, roadmap, message: "roadmap already exists" })
        }

        // Create new roadmap with 'generating' status
        if (!roadmap) {
            roadmap = await Roadmap.create({
                user: req.user.id,
                assessment: assessment._id,
                careerAdvice: '',
                roadmapContent: '',
                status: 'generating'
            });
        }

        //Generate AI content

        const careerAdvice = await generateCareerAdvice(assessment);
        const roadmapContent = await generateRoadmap(assessment);


        //Update roadmap
        roadmap.careerAdvice = careerAdvice;
        roadmap.roadmapContent = roadmapContent;
        roadmap.status = "completed";
        roadmap.updatedAt = Date.now();
        await roadmap.save();


        res.status(201).json({
            success: true,
            roadmap
        });

    } catch (error) {
        console.error('Roadmap generation error:', error);

        // Update status to failed if roadmap exists
        if (roadmap) {
            roadmap.status = 'failed';
            await roadmap.save();
        }

        res.status(500).json({
            message: 'Failed to generate roadmap',
            error: error.message
        });
    }
};

// Get user's roadmap
exports.getUserRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ user: req.user.id })
            .populate('assessment');

        if (!roadmap) {
            return res.status(404).json({
                message: 'No roadmap found. Please generate one first.'
            });
        }
        res.json({ success: true, roadmap });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Regenerate roadmap
exports.regenerateRoadmap = async (req, res) => {
    try {
        // Delete existing roadmap
        await Roadmap.findOneAndDelete({ user: req.user.id });

        // Generate new one
        return exports.generateUserRoadmap(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};