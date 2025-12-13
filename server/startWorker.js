require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
require('./workers/roadmapWorker');
console.log('🚀 Worker listening for jobs...');