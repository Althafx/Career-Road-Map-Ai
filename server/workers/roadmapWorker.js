const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const Roadmap = require('../models/Roadmap');
const { generateCareerAdvice, generateRoadmap } = require('../services/aiService');

const roadmapWorker = new Worker(
    'roadmap-generation',
    async (job) => {
        const { userId, assessmentId, assessmentData } = job.data;

        try {
            console.log('Processing job:', job.id);
            console.log('Assessment Data:', JSON.stringify(assessmentData, null, 2));

            await job.updateProgress(10);

            console.log('Generating career advice...');
            const careerAdvice = await generateCareerAdvice(assessmentData);
            await job.updateProgress(50);

            console.log('Generating roadmap content...');
            const roadmapContent = await generateRoadmap(assessmentData);
            await job.updateProgress(80);

            await Roadmap.findOneAndUpdate(
                { user: userId, assessmentId: assessmentId },
                {
                    careerAdvice,
                    roadmapContent,
                    status: 'completed',
                    updatedAt: Date.now()
                },
                { new: true, upsert: true }
            );

            await job.updateProgress(100);
            console.log('Job completed successfully');
            return { success: true };
        } catch (error) {
            console.error('Worker failed:', error);
            await Roadmap.findOneAndUpdate(
                { user: userId, assessmentId: assessmentId },
                { status: 'failed' }
            );
            throw error;
        }
    },
    { connection, concurrency: 2 }
);

roadmapWorker.on('completed', (job) => console.log(`✅ Job ${job.id} done`));
roadmapWorker.on('failed', (job, err) => console.error(`❌ Job ${job.id}:`, err.message));

module.exports = roadmapWorker;