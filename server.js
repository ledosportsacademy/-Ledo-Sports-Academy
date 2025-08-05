const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sglzc8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Import routes
const heroSlideRoutes = require('./routes/api/heroSlides');
const activityRoutes = require('./routes/api/activities');
const memberRoutes = require('./routes/api/members');
const donationRoutes = require('./routes/api/donations');
const expenseRoutes = require('./routes/api/expenses');
const experienceRoutes = require('./routes/api/experiences');
const weeklyFeeRoutes = require('./routes/api/weeklyFees');
const galleryRoutes = require('./routes/api/gallery');

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const status = {
    server: 'running',
    database: dbStatus === 1 ? 'connected' : 'disconnected',
    dbState: dbStatus
  };
  
  res.json(status);
});

// Use routes
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/weekly-fees', weeklyFeeRoutes);
app.use('/api/gallery', galleryRoutes);

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});