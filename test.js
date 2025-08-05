// Test script to verify MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sglzc8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    testDatabaseOperations();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Import models
const HeroSlide = require('./models/HeroSlide');
const Activity = require('./models/Activity');
const Member = require('./models/Member');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');
const Experience = require('./models/Experience');
const WeeklyFee = require('./models/WeeklyFee');
const Gallery = require('./models/Gallery');

// Test database operations
async function testDatabaseOperations() {
  try {
    // Create test data if collections are empty
    await createTestDataIfEmpty();
    
    // Test retrieving data from each collection
    const heroSlides = await HeroSlide.find().limit(1);
    const activities = await Activity.find().limit(1);
    const members = await Member.find().limit(1);
    const donations = await Donation.find().limit(1);
    const expenses = await Expense.find().limit(1);
    const experiences = await Experience.find().limit(1);
    const weeklyFees = await WeeklyFee.find().limit(1);
    const gallery = await Gallery.find().limit(1);
    
    console.log('\n📊 Database Test Results:');
    console.log(`HeroSlides: ${heroSlides.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Activities: ${activities.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Members: ${members.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Donations: ${donations.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Expenses: ${expenses.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Experiences: ${experiences.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`WeeklyFees: ${weeklyFees.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Gallery: ${gallery.length > 0 ? '✅ Found' : '❌ Not found'}`);
    
    console.log('\n🎉 Test completed successfully!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Create test data if collections are empty
async function createTestDataIfEmpty() {
  // Check if HeroSlide collection is empty
  const heroSlideCount = await HeroSlide.countDocuments();
  if (heroSlideCount === 0) {
    console.log('Creating test hero slide...');
    await HeroSlide.create({
      title: 'Test Hero Slide',
      subtitle: 'Testing MongoDB Connection',
      description: 'This is a test hero slide created by the test script.',
      backgroundImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop',
      ctaText: 'Test CTA',
      ctaLink: '#test'
    });
  }
  
  // Check if Activity collection is empty
  const activityCount = await Activity.countDocuments();
  if (activityCount === 0) {
    console.log('Creating test activity...');
    await Activity.create({
      title: 'Test Activity',
      date: new Date(),
      time: '12:00',
      description: 'This is a test activity created by the test script.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      status: 'upcoming',
      type: 'test'
    });
  }
  
  // Check if Member collection is empty
  const memberCount = await Member.countDocuments();
  if (memberCount === 0) {
    console.log('Creating test member...');
    await Member.create({
      name: 'Test Member',
      contact: 'test@example.com',
      phone: '+91-9876-543210',
      joinDate: new Date(),
      role: 'Test Role',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });
  }
}