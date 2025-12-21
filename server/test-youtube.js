require('dotenv').config();
const youtubeApi = require('./utils/youtubeApi');

async function testYoutube() {
    console.log('Testing YouTube API...');
    console.log('API Key exists:', !!process.env.YOUTUBE_API_KEY);
    console.log('API Key length:', process.env.YOUTUBE_API_KEY?.length);

    try {
        console.log('\n🎥 Testing searchPlaylists for "Leadership"...');
        const playlists = await youtubeApi.searchPlaylists('Leadership', 2);
        console.log(`Found ${playlists.length} playlists`);
        console.log('Playlists:', JSON.stringify(playlists, null, 2));

        console.log('\n🎥 Testing searchVideos for "Leadership"...');
        const videos = await youtubeApi.searchVideos('Leadership', 1);
        console.log(`Found ${videos.length} videos`);
        console.log('Videos:', JSON.stringify(videos, null, 2));
    } catch (error) {
        console.error('❌ Error Message:', error.message);
        if (error.response) {
            console.error('🔴 Status:', error.response.status);
            console.error('🔴 Data:', JSON.stringify(error.response.data, null, 2));
        }
        console.error('Full error object:', error);
    }
}

testYoutube();
