// server.js - Main entry point for Node.js backend
// Think of this as the "main gate" of your backend

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create express app
// Think of app as your server instance
const app = express();

// MIDDLEWARE - these run on every request
// Allow React (port 3000) to talk to this backend (port 5000)
app.use(cors({
  origin: 'http://localhost:5173', // React runs on this port (Vite)
  credentials: true
}));

// Allow server to understand JSON data sent from React
app.use(express.json());

// ROUTES - import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// TEST ROUTE - to check if server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'FilmFusion Backend is running! 🎬',
    status: 'success'
  });
});

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message);
  });

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});