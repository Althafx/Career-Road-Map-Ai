const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const connectDB = require("./config/db");
const syncEmbeddings = require('./scripts/syncEmbeddings');
const authRoutes = require("./routes/auth")
const assessmentRoutes = require('./routes/assessment');
const roadmapRoutes = require('./routes/roadmap')
const resourceRoutes = require('./routes/resources')

connectDB().then(() => {
    // Sync vector store on startup (non-blocking)
    syncEmbeddings().catch(err => console.error('Initial sync failed:', err));

    // Start background worker in same process (Free Tier optimization)
    try {
        require('./workers/roadmapWorker');
        console.log('🚀 Background Worker started in main process');
    } catch (error) {
        console.error('❌ WORKER FAILED TO START:', error.message);
        console.error('Full error:', error);
    }
});
const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173', // Vite default
    'http://localhost:3000',
    'http://localhost:5174'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', require('./routes/admin'));

app.get('/api/test', (req, res) => {
    res.json({ message: "backend is working" })
})

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the ai career map" })
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})