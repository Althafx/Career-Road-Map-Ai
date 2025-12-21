require('dotenv').config();
const { generateResourcesForSkills } = require('./services/aiService');

async function testAiResources() {
    console.log('🧪 Testing AI Resource Generation...');
    try {
        const skills = ['React', 'Leadership'];
        console.log(`Searching for: ${skills.join(', ')}`);

        const resources = await generateResourcesForSkills(skills);

        console.log(`\n✅ Generated ${resources.length} resources:`);
        resources.forEach(r => {
            console.log(`\n- [${r.type.toUpperCase()}] ${r.title}`);
            console.log(`  URL: ${r.url}`);
            console.log(`  Source: ${r.source}`);
        });

        const hasYoutube = resources.some(r => r.url.includes('youtube.com'));
        console.log(`\n🎥 Contains YouTube links? ${hasYoutube ? 'YES ✅' : 'NO ❌'}`);

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testAiResources();
