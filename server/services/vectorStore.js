const lancedb = require('@lancedb/lancedb');
const embeddingService = require('./embeddingService');
const path = require('path');
const fs = require('fs');

// Embedded DB path
const DB_DIR = path.join(__dirname, '../data/lancedb');
const TABLE_NAME = 'resources';

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

let db = null;
let table = null;

const initVectorStore = async () => {
    if (table) return;

    try {
        console.log(`🔌 Connecting to LanceDB at ${DB_DIR}...`);
        db = await lancedb.connect(DB_DIR);

        // Check if table exists
        const tableNames = await db.tableNames();

        if (tableNames.includes(TABLE_NAME)) {
            table = await db.openTable(TABLE_NAME);
            console.log(`✅ Opened existing table '${TABLE_NAME}'`);
        } else {
            console.log(`📝 Table '${TABLE_NAME}' will be created on first insert.`);
        }
    } catch (error) {
        console.error("❌ LanceDB Connection Failed:", error);
    }
};

const addResourceToVectorDB = async (resource) => {
    // 1. Generate text to embed
    const textToEmbed = `${resource.title}. ${resource.description}. Skills: ${resource.skills.join(', ')}`;

    // 2. Generate embedding
    let embedding;
    try {
        embedding = await embeddingService.generateEmbedding(textToEmbed);
    } catch (e) {
        console.error(`Error generating embedding for ${resource.title}:`, e);
        return;
    }

    if (!db) await initVectorStore();

    // LanceDB record
    const record = {
        id: resource._id.toString(),
        vector: embedding,
        title: resource.title,
        type: resource.type,
        url: resource.url,
        text: textToEmbed
    };

    try {
        if (!table) {
            // Create table with the first record
            table = await db.createTable(TABLE_NAME, [record]);
            console.log(`✅ Created table '${TABLE_NAME}' with 1st record.`);
        } else {
            // Append to existing table
            await table.add([record]);
            console.log(`Saved vector for: ${resource.title}`);
        }
    } catch (e) {
        console.error("Error adding to LanceDB:", e);
    }
};

const searchSimilarResources = async (queryText, limit = 5) => {
    if (!db) await initVectorStore();
    if (!table) return { ids: [[]] }; // Return empty structure if no table

    try {
        // Embed the query
        const queryEmbedding = await embeddingService.generateEmbedding(queryText);

        // Search
        const results = await table.search(queryEmbedding)
            .limit(limit)
            .toArray();

        // Map to structure expected by controller: { ids: [ ['id1', 'id2'] ] }
        const ids = results.map(r => r.id);

        return { ids: [ids] };

    } catch (e) {
        console.error("Error searching LanceDB:", e);
        return { ids: [[]] };
    }
};

module.exports = {
    initVectorStore,
    addResourceToVectorDB,
    searchSimilarResources
};
