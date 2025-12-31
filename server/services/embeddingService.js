
// Using dynamic import for ESM module
const getPipeline = async () => {
    const { pipeline } = await import('@xenova/transformers');
    return pipeline;
};

class EmbeddingService {
    constructor() {
        this.extractor = null;
        this.modelName = 'Xenova/all-MiniLM-L6-v2'; // Standard, small, efficient model
    }

    async init() {
        if (!this.extractor) {
            console.log(`🔌 Initializing local embedding model: ${this.modelName}...`);
            const pipeline = await getPipeline();
            this.extractor = await pipeline('feature-extraction', this.modelName, {
                quantized: true, // Use quantized version for speed
            });
            console.log("✅ Embedding model ready.");
        }
    }

    async generateEmbedding(text) {
        if (!this.extractor) await this.init();

        // Generate embedding
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });

        // Convert Tensor to JavaScript Array
        return Array.from(output.data);
    }
}

// Singleton instance
const embeddingService = new EmbeddingService();

module.exports = embeddingService;
