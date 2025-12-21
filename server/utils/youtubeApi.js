const axios = require('axios');

class YouTubeAPI {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.baseURL = 'https://www.googleapis.com/youtube/v3';
    }

    /**
     * Search for playlists related to a skill
     * @param {string} skill - The skill keyword to search for
     * @param {number} maxResults - Maximum results to return (default: 3)
     * @returns {Promise<Array>} Formatted resource objects
     */
    async searchPlaylists(skill, maxResults = 3) {
        // Edge case: No API key configured
        if (!this.apiKey) {
            console.warn('YouTube API key not configured. Skipping YouTube search.');
            return [];
        }

        try {
            const response = await axios.get(`${this.baseURL}/search`, {
                params: {
                    part: 'snippet',
                    q: `${skill} tutorial playlist`,
                    type: 'playlist',
                    maxResults: maxResults,
                    key: this.apiKey,
                    order: 'relevance',
                    videoDuration: 'medium' // Focus on substantial playlists
                }
            });

            // Edge case: No results found
            if (!response.data.items || response.data.items.length === 0) {
                return [];
            }

            // Get playlist details for item count
            const playlistIds = response.data.items.map(item => item.id.playlistId).join(',');
            const detailsResponse = await axios.get(`${this.baseURL}/playlists`, {
                params: {
                    part: 'contentDetails',
                    id: playlistIds,
                    key: this.apiKey
                }
            });

            const itemCounts = {};
            detailsResponse.data.items.forEach(item => {
                itemCounts[item.id] = item.contentDetails.itemCount;
            });

            // Format results to match Resource schema
            return response.data.items.map(item => ({
                title: item.snippet.title,
                description: item.snippet.description.substring(0, 200), // Truncate
                url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
                type: 'playlist',
                difficulty: 'intermediate', // YouTube playlists are usually comprehensive
                duration: `${itemCounts[item.id.playlistId] || 'Multiple'} videos`,
                skills: [skill.toLowerCase()],
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                author: item.snippet.channelTitle,
                rating: 4, // Default rating
                source: 'youtube' // Mark as dynamic source
            }));

        } catch (error) {
            // Edge cases: API errors
            if (error.response?.status === 403) {
                console.error('❌ QUOTA/KEY ERROR:', error.response.data?.error?.message || 'Unknown 403 error');
                console.error('Full Error Data:', JSON.stringify(error.response?.data, null, 2));
            } else if (error.response?.status === 400) {
                console.error('Invalid YouTube API request parameters');
            } else {
                console.error('YouTube API error:', error.message);
            }
            return []; // Fail gracefully
        }
    }

    /**
     * Search for individual tutorial videos
     * @param {string} skill - The skill keyword
     * @param {number} maxResults - Max results
     */
    async searchVideos(skill, maxResults = 5) {
        if (!this.apiKey) return [];

        try {
            const response = await axios.get(`${this.baseURL}/search`, {
                params: {
                    part: 'snippet',
                    q: `${skill} tutorial`,
                    type: 'video',
                    maxResults: maxResults,
                    key: this.apiKey,
                    order: 'relevance',
                    videoDuration: 'medium'
                }
            });

            if (!response.data.items) return [];

            return response.data.items.map(item => ({
                title: item.snippet.title,
                description: item.snippet.description.substring(0, 200),
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                type: 'video',
                difficulty: 'intermediate',
                duration: 'Video',
                skills: [skill.toLowerCase()],
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                author: item.snippet.channelTitle,
                rating: 4,
                source: 'youtube'
            }));
        } catch (error) {
            console.error('YouTube video search error:', error.message);
            return [];
        }
    }
}

module.exports = new YouTubeAPI();
