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
});
const app = express();

app.use(cors());
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