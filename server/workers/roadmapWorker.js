const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const Roadmap = require('../models/Roadmap');
const Resource = require('../models/Resource');
const { generateCareerAdvice, generateRoadmap, generateResourcesForSkills } = require('../services/aiService');

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

            // ---------------------------------------------------------
            // DYNAMIC RESOURCE GENERATION
            // ---------------------------------------------------------
            try {
                await job.updateProgress(90);
                console.log('🔮 Generating dynamic resources for roadmap skills...');

                // 1. Extract skills from assessment data
                let allSkills = [];
                if (assessmentData.skills) {
                    const userSkills = Array.isArray(assessmentData.skills)
                        ? assessmentData.skills
                        : assessmentData.skills.split(',').map(s => s.trim());
                    allSkills = [...userSkills];
                }

                // 2. Extract skills from generated roadmap (if possible)
                try {
                    const parsedRoadmap = JSON.parse(roadmapContent);
                    if (parsedRoadmap.phases) {
                        parsedRoadmap.phases.forEach(phase => {
                            if (phase.skills && Array.isArray(phase.skills)) {
                                allSkills.push(...phase.skills);
                            }
                        });
                    }
                } catch (e) {
                    console.log('Could not parse roadmap for extra skills, using inputs only.');
                }

                // 3. Deduplicate skills
                const uniqueSkills = [...new Set(allSkills.map(s => s.trim()))]; // basic dedup

                if (uniqueSkills.length > 0) {
                    console.log('🔍 Generating resources for:', uniqueSkills.join(', '));
                    const newResources = await generateResourcesForSkills(uniqueSkills);

                    if (newResources.length > 0) {
                        // Upsert resources to avoid duplicates
                        const ops = newResources.map(resource => ({
                            updateOne: {
                                filter: { url: resource.url },
                                update: { $setOnInsert: resource },
                                upsert: true
                            }
                        }));

                        await Resource.bulkWrite(ops);
                        console.log(`✅ Saved ${newResources.length} new dynamic resources!`);
                    }
                }
            } catch (resourceError) {
                console.error('⚠️ Resource generation failed (non-fatal):', resourceError);
                // Don't fail the whole job, just log it
            }

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