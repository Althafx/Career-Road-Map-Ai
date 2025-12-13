const { roadmapQueue } = require('../config/queue');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

exports.generateUserRoadmap = async (req, res) => {
    let roadmap;
    try {
        const { assessmentId } = req.body;

        if (!assessmentId) {
            return res.status(400).json({ message: 'Assessment ID required' });
        }

        const user = await User.findById(req.user.id);
        const assessment = user.assessments.id(assessmentId);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        roadmap = await Roadmap.findOne({
            user: req.user.id,
            assessmentId: assessmentId
        });

        if (roadmap?.status === 'completed') {
            return res.json({ success: true, roadmap, message: 'Already exists' });
        }
        if (roadmap?.status === 'generating') {
            return res.json({ success: true, roadmap, message: 'In progress' });
        }

        if (!roadmap) {
            roadmap = await Roadmap.create({
                user: req.user.id,
                assessmentId: assessmentId,
                careerAdvice: '',
                roadmapContent: '',
                status: 'generating'
            });
        } else {
            roadmap.status = 'generating';
            await roadmap.save();
        }

        console.log('--- Debugging Roadmap Controller ---');
        console.log('Assessment ID:', assessmentId);
        console.log('Assessment Object found:', !!assessment);
        if (assessment) {
            console.log('Assessment Data (toObject):', JSON.stringify(assessment.toObject(), null, 2));
        }

        const job = await roadmapQueue.add('generate-roadmap', {
            userId: req.user.id,
            assessmentId: assessmentId,
            assessmentData: assessment.toObject()
        });

        res.status(202).json({
            success: true,
            message: 'Generation started',
            jobId: job.id,
            roadmap
        });
    } catch (error) {
        if (roadmap) {
            roadmap.status = 'failed';
            await roadmap.save();
        }
        res.status(500).json({ message: 'Failed to start', error: error.message });
    }
};

exports.getUserRoadmap = async (req, res) => {
    try {
        const { assessmentId } = req.query;

        if (!assessmentId) {
            return res.status(400).json({ message: 'Assessment ID required' });
        }

        const roadmap = await Roadmap.findOne({
            user: req.user.id,
            assessmentId: assessmentId
        });

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

exports.regenerateRoadmap = async (req, res) => {
    try {
        const { assessmentId } = req.body;

        if (!assessmentId) {
            return res.status(400).json({ message: 'Assessment ID required' });
        }

        await Roadmap.findOneAndDelete({
            user: req.user.id,
            assessmentId: assessmentId
        });

        return exports.generateUserRoadmap(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await roadmapQueue.getJob(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job.progress || 0;

        res.json({ success: true, jobId: job.id, state, progress });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};