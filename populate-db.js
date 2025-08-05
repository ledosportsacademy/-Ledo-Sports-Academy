// Script to populate MongoDB with sample data for Ledo Sports Academy
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sglzc8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Import models
const HeroSlide = require('./models/HeroSlide');
const Activity = require('./models/Activity');
const Member = require('./models/Member');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');
const Experience = require('./models/Experience');
const WeeklyFee = require('./models/WeeklyFee');
const Gallery = require('./models/Gallery');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    populateDatabase();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Main function to populate the database
async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await clearExistingData();
    
    // Create sample data for each collection
    await createHeroSlides();
    await createActivities();
    await createMembers();
    await createDonations();
    await createExpenses();
    await createExperiences();
    await createGallery();
    // Weekly fees will be created after members
    await createWeeklyFees();
    
    console.log('\n🎉 Database populated successfully!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database population failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Clear existing data
async function clearExistingData() {
  console.log('Clearing existing data...');
  await HeroSlide.deleteMany({});
  await Activity.deleteMany({});
  await Member.deleteMany({});
  await Donation.deleteMany({});
  await Expense.deleteMany({});
  await Experience.deleteMany({});
  await WeeklyFee.deleteMany({});
  await Gallery.deleteMany({});
  console.log('✅ Existing data cleared');
}

// Create hero slides
async function createHeroSlides() {
  console.log('Creating hero slides...');
  const heroSlides = [
    {
      title: 'Welcome to Ledo Sports Academy',
      subtitle: 'Developing Champions',
      description: 'Join us for exciting sports activities and training programs',
      backgroundImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop',
      ctaText: 'Join Now',
      ctaLink: '#members',
      redirectUrl: '',
      openNewTab: false
    },
    {
      title: 'Summer Training Camp',
      subtitle: 'Ages 8-16',
      description: 'Intensive training sessions with professional coaches',
      backgroundImage: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&h=800&fit=crop',
      ctaText: 'Register',
      ctaLink: '#activities',
      redirectUrl: '',
      openNewTab: false
    },
    {
      title: 'New Equipment Arrived',
      subtitle: 'State-of-the-art Facilities',
      description: 'Train with the best equipment in town',
      backgroundImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop',
      ctaText: 'Learn More',
      ctaLink: '#gallery',
      redirectUrl: '',
      openNewTab: false
    }
  ];
  
  await HeroSlide.insertMany(heroSlides);
  console.log(`✅ Created ${heroSlides.length} hero slides`);
}

// Create activities
async function createActivities() {
  console.log('Creating activities...');
  const activities = [
    {
      title: 'Weekend Football Tournament',
      date: '2023-12-15',
      time: '09:00 - 17:00',
      description: 'A friendly football tournament for all age groups',
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=600&fit=crop',
      status: 'upcoming',
      type: 'tournament'
    },
    {
      title: 'Basketball Training Camp',
      date: '2023-12-10',
      time: '14:00 - 18:00',
      description: 'Intensive basketball training with professional coaches',
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&h=600&fit=crop',
      status: 'upcoming',
      type: 'training'
    },
    {
      title: 'Swimming Competition',
      date: '2023-11-30',
      time: '10:00 - 15:00',
      description: 'Annual swimming competition with multiple categories',
      image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&h=600&fit=crop',
      status: 'completed',
      type: 'event'
    },
    {
      title: 'Yoga for Athletes',
      date: '2023-12-05',
      time: '07:00 - 08:30',
      description: 'Yoga sessions designed specifically for athletes',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      status: 'upcoming',
      type: 'training'
    }
  ];
  
  await Activity.insertMany(activities);
  console.log(`✅ Created ${activities.length} activities`);
}

// Create members
async function createMembers() {
  console.log('Creating members...');
  const members = [
    {
      name: 'John Doe',
      contact: 'john.doe@example.com',
      phone: '+91-9876-543210',
      joinDate: new Date('2023-01-15'),
      role: 'Student',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Jane Smith',
      contact: 'jane.smith@example.com',
      phone: '+91-9876-543211',
      joinDate: new Date('2023-02-20'),
      role: 'Coach',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Johnson',
      contact: 'michael.j@example.com',
      phone: '+91-9876-543212',
      joinDate: new Date('2023-03-10'),
      role: 'Student',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Williams',
      contact: 'emily.w@example.com',
      phone: '+91-9876-543213',
      joinDate: new Date('2023-04-05'),
      role: 'Student',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Robert Brown',
      contact: 'robert.b@example.com',
      phone: '+91-9876-543214',
      joinDate: new Date('2023-05-22'),
      role: 'Admin',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];
  
  await Member.insertMany(members);
  console.log(`✅ Created ${members.length} members`);
}

// Create donations
async function createDonations() {
  console.log('Creating donations...');
  const donations = [
    {
      donorName: 'Community Sports Foundation',
      amount: 25000,
      date: '2023-06-15',
      purpose: 'Equipment',
      notes: 'Annual donation for sports equipment'
    },
    {
      donorName: 'Local Business Association',
      amount: 15000,
      date: '2023-07-10',
      purpose: 'Scholarships',
      notes: 'To support underprivileged athletes'
    },
    {
      donorName: 'Anonymous Donor',
      amount: 50000,
      date: '2023-08-05',
      purpose: 'Facility Improvement',
      notes: 'For upgrading the training facilities'
    },
    {
      donorName: 'Alumni Association',
      amount: 10000,
      date: '2023-09-20',
      purpose: 'Tournaments',
      notes: 'To organize inter-school tournaments'
    }
  ];
  
  await Donation.insertMany(donations);
  console.log(`✅ Created ${donations.length} donations`);
}

// Create expenses
async function createExpenses() {
  console.log('Creating expenses...');
  const expenses = [
    {
      description: 'New Training Equipment',
      amount: 15000,
      date: new Date('2023-06-20'),
      category: 'Equipment',
      vendor: 'Sports Gear Ltd.',
      paymentMethod: 'Bank Transfer'
    },
    {
      description: 'Facility Maintenance',
      amount: 8000,
      date: new Date('2023-07-15'),
      category: 'Maintenance',
      vendor: 'City Maintenance Services',
      paymentMethod: 'Check'
    },
    {
      description: 'Coach Salaries',
      amount: 35000,
      date: new Date('2023-08-01'),
      category: 'Salaries',
      vendor: 'Staff',
      paymentMethod: 'Bank Transfer'
    },
    {
      description: 'Tournament Registration Fees',
      amount: 5000,
      date: new Date('2023-09-10'),
      category: 'Events',
      vendor: 'State Sports Association',
      paymentMethod: 'Online Payment'
    },
    {
      description: 'Utility Bills',
      amount: 7500,
      date: new Date('2023-10-05'),
      category: 'Utilities',
      vendor: 'City Power & Water',
      paymentMethod: 'Direct Debit'
    }
  ];
  
  await Expense.insertMany(expenses);
  console.log(`✅ Created ${expenses.length} expenses`);
}

// Create experiences
async function createExperiences() {
  console.log('Creating experiences...');
  const experiences = [
    {
      title: 'State Championship Win',
      date: new Date('2023-05-15'),
      description: 'Our basketball team won the state championship for the first time in academy history',
      image: 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&h=600&fit=crop'
    },
    {
      title: 'New Swimming Pool Inauguration',
      date: new Date('2023-07-20'),
      description: 'Inaugurated our new Olympic-sized swimming pool with a friendly competition',
      image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&h=600&fit=crop'
    },
    {
      title: 'Annual Sports Day',
      date: new Date('2023-08-12'),
      description: 'Successful completion of our annual sports day with participation from over 200 students',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
    }
  ];
  
  await Experience.insertMany(experiences);
  console.log(`✅ Created ${experiences.length} experiences`);
}

// Create gallery items
async function createGallery() {
  console.log('Creating gallery items...');
  const galleryItems = [
    {
      title: 'Basketball Practice',
      description: 'Students practicing basketball techniques',
      imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&h=600&fit=crop',
      isTop5: true,
      top5Order: 1
    },
    {
      title: 'Swimming Competition',
      description: 'Annual swimming competition',
      imageUrl: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&h=600&fit=crop',
      isTop5: true,
      top5Order: 2
    },
    {
      title: 'Football Tournament',
      description: 'Inter-school football tournament',
      imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=600&fit=crop',
      isTop5: true,
      top5Order: 3
    },
    {
      title: 'Yoga Session',
      description: 'Morning yoga session for athletes',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      isTop5: false,
      top5Order: 0
    },
    {
      title: 'Athletics Track',
      description: 'Our newly renovated athletics track',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      isTop5: true,
      top5Order: 4
    },
    {
      title: 'Gym Equipment',
      description: 'New gym equipment for strength training',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      isTop5: true,
      top5Order: 5
    },
    {
      title: 'Team Building Activities',
      description: 'Students participating in team building exercises',
      imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&h=600&fit=crop',
      isTop5: false,
      top5Order: 0
    }
  ];
  
  await Gallery.insertMany(galleryItems);
  console.log(`✅ Created ${galleryItems.length} gallery items`);
}

// Create weekly fees
async function createWeeklyFees() {
  console.log('Creating weekly fees...');
  
  // Get all members
  const members = await Member.find();
  
  // Create weekly fee records for each member
  for (const member of members) {
    if (member.role === 'Student') {
      const weeklyFee = {
        memberId: member._id,
        memberName: member.name,
        payments: [
          {
            date: new Date('2023-11-01'),
            amount: 500,
            status: 'paid'
          },
          {
            date: new Date('2023-11-08'),
            amount: 500,
            status: 'paid'
          },
          {
            date: new Date('2023-11-15'),
            amount: 500,
            status: 'pending'
          }
        ]
      };
      
      await WeeklyFee.create(weeklyFee);
    }
  }
  
  const weeklyFeeCount = await WeeklyFee.countDocuments();
  console.log(`✅ Created weekly fees for ${weeklyFeeCount} members`);
}