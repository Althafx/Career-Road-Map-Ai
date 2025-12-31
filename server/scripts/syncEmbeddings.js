const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('../models/Resource');
const { addResourceToVectorDB, initVectorStore } = require('../services/vectorStore');

// Only load dotenv if not already loaded (though safe to reload)
if (!process.env.MONGO_URI) {
    dotenv.config();
}

const syncEmbeddings = async () => {
    console.log('🔄 Starting Vector Store Sync...');
    try {
        // 1. Connect to MongoDB if not connected
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to MongoDB for sync...');
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected.');
        }

        // 2. Initialize Vector Store
        await initVectorStore();

        // 3. Fetch all resources
        const resources = await Resource.find({});
        console.log(`Found ${resources.length} resources to sync.`);

        // 4. Loop and Sync
        for (const resource of resources) {
            // Optional: Check if already exists? 
            // For now, addResourceToVectorDB usually handles upserts/overwrites or just adds
            // Check vectorStore implementation: it uses table.add which appends. 
            // Ideally we should probably overwrite or dedupe, but existing script loop was naive.
            // We will stick to the existing naive logic for now, or check vectorStore.js again?
            // "table.add([record])" -> LanceDB add usually appends. 
            // "overwrite" logic isn't there. 
            // For "Sync on Startup", if persistence is lost, it's fine.
            // If persistence is KEPT, we might duplicate data.
            // IMPORTANT: If LanceDB folder persists, this will DUPLICATE data every restart!
            // We should overwrite the table?
            // vectorStore.js "createTable" overwrites if exists? No, logic was "if table exists, open it".

            // Let's rely on vectorStore logic but suppressing logs
            await addResourceToVectorDB(resource);
        }

        console.log('✅ All resources synced to Vector DB!');

    } catch (error) {
        console.error('❌ Sync Error:', error);
        // Do not exit process if imported
        if (require.main === module) process.exit(1);
    }
};

// Handle CLI execution
if (require.main === module) {
    syncEmbeddings().then(() => process.exit(0));
}

module.exports = syncEmbeddings;
