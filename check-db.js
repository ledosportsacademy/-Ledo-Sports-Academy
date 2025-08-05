// Script to check MongoDB data for Ledo Sports Academy
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sglzc8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully!');
    await checkDatabase();
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Function to check database collections
async function checkDatabase() {
  try {
    console.log('\n📊 Database Collection Counts:');
    console.log('----------------------------');
    
    // Import models
    const HeroSlide = require('./models/HeroSlide');
    const Activity = require('./models/Activity');
    const Member = require('./models/Member');
    const Donation = require('./models/Donation');
    const Expense = require('./models/Expense');
    const Experience = require('./models/Experience');
    const WeeklyFee = require('./models/WeeklyFee');
    const Gallery = require('./models/Gallery');
    
    // Check counts
    const heroSlideCount = await HeroSlide.countDocuments();
    const activityCount = await Activity.countDocuments();
    const memberCount = await Member.countDocuments();
    const donationCount = await Donation.countDocuments();
    const expenseCount = await Expense.countDocuments();
    const experienceCount = await Experience.countDocuments();
    const weeklyFeeCount = await WeeklyFee.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    
    // Display counts
    console.log(`HeroSlide: ${heroSlideCount} documents`);
    console.log(`Activity: ${activityCount} documents`);
    console.log(`Member: ${memberCount} documents`);
    console.log(`Donation: ${donationCount} documents`);
    console.log(`Expense: ${expenseCount} documents`);
    console.log(`Experience: ${experienceCount} documents`);
    console.log(`WeeklyFee: ${weeklyFeeCount} documents`);
    console.log(`Gallery: ${galleryCount} documents`);
    console.log('----------------------------');
    
    // Get a sample document from each collection
    if (heroSlideCount > 0) {
      const heroSlideSample = await HeroSlide.findOne();
      console.log('\n📝 Sample HeroSlide:', heroSlideSample.title);
    }
    
    if (activityCount > 0) {
      const activitySample = await Activity.findOne();
      console.log('📝 Sample Activity:', activitySample.title);
    }
    
    if (memberCount > 0) {
      const memberSample = await Member.findOne();
      console.log('📝 Sample Member:', memberSample.name);
    }
    
    if (galleryCount > 0) {
      const gallerySample = await Gallery.findOne();
      console.log('📝 Sample Gallery Item:', gallerySample.title);
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}