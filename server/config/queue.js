const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
})

const roadmapQueue = new Queue('roadmap-generation', {connection})

module.exports ={roadmapQueue, connection}