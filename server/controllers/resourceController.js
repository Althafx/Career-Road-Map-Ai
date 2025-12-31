const Resource = require('../models/Resource');
const youtubeApi = require('../utils/youtubeApi');
const { searchSimilarResources } = require('../services/vectorStore');

/**
 * Get learning resources for specific skills or semantic query
 * Hybrid approach: Vector Search (Chroma) + Database Filter + YouTube API
 */
exports.getResourcesForSkills = async (req, res) => {
    try {
        const { skills, q } = req.query;

        console.log(`🔎 Resource Search | Skills: ${skills} | Query: ${q}`);

        let dbResources = [];
        let skillArray = [];

        // 1. Vector Search (Semantic) -- If 'q' is provided
        if (q) {
            console.log(`🧠 Performing Semantic Search for: "${q}"`);
            const vectorResults = await searchSimilarResources(q, 10);

            // Vector results are just IDs and basic metadata
            // We need to fetch the full documents from Mongo to match the UI shape
            if (vectorResults && vectorResults.ids && vectorResults.ids.length > 0) {
                // Chroma returns ids as [ ['id1', 'id2'] ] (list of lists)
                const ids = vectorResults.ids[0];

                dbResources = await Resource.find({
                    _id: { $in: ids }
                });

                console.log(`   → Found ${dbResources.length} semantic matches`);
            }
        }

        // 2. Skill-based Search (Fallback or Filter) -- If 'skills' provided
        if (skills && dbResources.length < 5) {
            skillArray = Array.isArray(skills)
                ? skills
                : skills.split(',').map(s => s.trim().toLowerCase());

            if (skillArray.length > 0) {
                const keywordResources = await Resource.find({
                    skills: { $in: skillArray },
                    // Exclude ones we already found via vector search
                    _id: { $nin: dbResources.map(r => r._id) }
                })
                    .limit(20)
                    .sort({ rating: -1, createdAt: -1 });

                console.log(`   → Found ${keywordResources.length} keyword matches`);
                dbResources = [...dbResources, ...keywordResources];
            }
        }

        // 3. YouTube Supplementation (if low results)
        let allResources = [...dbResources];

        if (allResources.length < 5 && (q || skillArray.length > 0)) {
            try {
                const searchTerm = q || skillArray[0]; // Prefer query, fallback to first skill
                console.log(`🎥 Supplementing with YouTube for: "${searchTerm}"`);

                // Get 2 playlists and 2 videos
                const playlists = await youtubeApi.searchPlaylists(searchTerm, 2);
                const videos = await youtubeApi.searchVideos(searchTerm, 2);

                const youtubeResults = [...playlists, ...videos];
                console.log(`   → Found ${youtubeResults.length} YouTube results`);

                allResources = [...allResources, ...youtubeResults];
            } catch (error) {
                console.error('⚠️ YouTube supplementation failed:', error.message);
            }
        }

        // Deduplicate by URL
        const uniqueResources = allResources.filter((resource, index, self) =>
            index === self.findIndex(r => r.url === resource.url)
        );

        res.json({
            success: true,
            resources: uniqueResources.slice(0, 15),
            count: uniqueResources.length,
            isSemantic: !!q
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
