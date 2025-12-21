const Resource = require('../models/Resource');
const youtubeApi = require('../utils/youtubeApi');

/**
 * Get learning resources for specific skills
 * Hybrid approach: Database + YouTube API
 */
exports.getResourcesForSkills = async (req, res) => {
    try {
        const { skills } = req.query;

        // Edge case: No skills provided
        if (!skills || skills.length === 0) {
            return res.json({
                success: true,
                resources: [],
                message: 'No skills specified'
            });
        }

        // Parse skills (could be comma-separated string or array)
        const skillArray = Array.isArray(skills)
            ? skills
            : skills.split(',').map(s => s.trim().toLowerCase());

        // Edge case: Empty array after parsing
        if (skillArray.length === 0) {
            return res.json({ success: true, resources: [] });
        }

        // Search database for matching resources
        const dbResources = await Resource.find({
            skills: { $in: skillArray }
        })
            .limit(20) // Limit for performance
            .sort({ rating: -1, createdAt: -1 }); // Best rated, newest first

        let allResources = [...dbResources];

        // Always supplement with YouTube if we don't have enough database results
        // This ensures we show resources for ANY skill topic (tech or non-tech)
        console.log(`📊 Current DB resources: ${dbResources.length}, allResources: ${allResources.length}`);
        console.log(`📊 Will search YouTube? ${allResources.length < 8 && skillArray.length > 0}`);

        if (allResources.length < 8 && skillArray.length > 0) {
            try {
                const youtubeResults = [];

                // Search YouTube for each skill (max 3 skills to avoid rate limits)
                const skillsToSearch = skillArray.slice(0, 3);

                console.log(`🎥 Searching YouTube for: ${skillsToSearch.join(', ')}`);

                for (const skill of skillsToSearch) {
                    // Get 2 playlists and 1 video per skill
                    const playlists = await youtubeApi.searchPlaylists(skill, 2);
                    const videos = await youtubeApi.searchVideos(skill, 1);

                    youtubeResults.push(...playlists, ...videos);
                    console.log(`   → Found ${playlists.length + videos.length} YouTube results for "${skill}"`);
                }

                console.log(`🎥 Total YouTube results: ${youtubeResults.length}`);
                allResources = [...allResources, ...youtubeResults];
            } catch (error) {
                console.error('⚠️ YouTube supplementation failed:', error.message);
                // Continue with DB results only
            }
        }

        // Deduplicate by URL
        const uniqueResources = allResources.filter((resource, index, self) =>
            index === self.findIndex(r => r.url === resource.url)
        );

        console.log(`📚 Resource API called for skills: ${skillArray.join(', ')}`);
        console.log(`   → DB results: ${dbResources.length}`);
        console.log(`   → Total results: ${uniqueResources.length}`);

        res.json({
            success: true,
            resources: uniqueResources.slice(0, 10), // Top 10
            count: uniqueResources.length,
            source: {
                database: dbResources.length,
                youtube: uniqueResources.length - dbResources.length
            }
        });

    } catch (error) {
        console.error('Resource fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
};

/**
 * Get resources by type
 */
exports.getResourcesByType = async (req, res) => {
    try {
        const { type, skills } = req.query;

        const query = {};
        if (type) query.type = type;
        if (skills) {
            const skillArray = Array.isArray(skills) ? skills : skills.split(',');
            query.skills = { $in: skillArray };
        }

        const resources = await Resource.find(query)
            .limit(20)
            .sort({ rating: -1 });

        res.json({
            success: true,
            resources,
            count: resources.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resources by type',
            error: error.message
        });
    }
};

/**
 * Admin: Add a new resource manually
 */
exports.addResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();

        res.status(201).json({
            success: true,
            resource,
            message: 'Resource added successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to add resource',
            error: error.message
        });
    }
};
