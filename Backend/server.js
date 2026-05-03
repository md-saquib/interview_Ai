const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/mongo_db');
const app = require('./src/app');
const { isLogin } = require('./src/middlewares/isLogin');

connectDB();

// cors implementation
const cors = require('cors');
app.use(cors({
    // IMPORTANT: origin: "*" aur credentials: true saath kaam nahi karta (browser block karta hai)
    // Isliye apna React frontend ka exact origin daal
    origin: 'https://job-interview-ai.netlify.app/',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// Middleware to convert JSON to object
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());


// Auth Routes 
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);




// Interview Report Routes
const interviewReportRoutes = require('./src/routes/interviewAiRoutes');
app.use('/api/interview', interviewReportRoutes);






// Home Route
app.get('/api/home', isLogin, (req, res) => {
    res.status(200).json({
        message: "Interview AI Backend is running"
    })
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
server.timeout = 300000;