const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth")
const assessmentRoutes = require('./routes/assessment');
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/assessment', assessmentRoutes);

app.get('/api/test', (req,res)=>{
    res.json({message: "backend is working"})
})

app.get("/",(req,res)=>{
    res.json({message: "Welcome to the ai career map"})
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})