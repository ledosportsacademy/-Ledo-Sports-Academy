// API functions for Ledo Sports Academy

// Base API URL
const API_URL = '/api';

// Generic fetch function with error handling
async function fetchAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    showMessage(`API Request Failed: ${error.message}`, 'error');
    throw error;
  }
}

// Hero Slides API
const heroSlidesAPI = {
  getAll: async () => await fetchAPI('/hero-slides'),
  create: async (data) => await fetchAPI('/hero-slides', 'POST', data),
  update: async (data) => await fetchAPI('/hero-slides', 'POST', data),
  delete: async (id) => await fetchAPI(`/hero-slides/${id}`, 'DELETE')
};

// Activities API
const activitiesAPI = {
  getAll: async () => await fetchAPI('/activities'),
  create: async (data) => await fetchAPI('/activities', 'POST', data),
  update: async (data) => await fetchAPI('/activities', 'POST', data),
  delete: async (id) => await fetchAPI(`/activities/${id}`, 'DELETE')
};

// Members API
const membersAPI = {
  getAll: async () => await fetchAPI('/members'),
  create: async (data) => await fetchAPI('/members', 'POST', data),
  update: async (data) => await fetchAPI('/members', 'POST', data),
  delete: async (id) => await fetchAPI(`/members/${id}`, 'DELETE')
};

// Donations API
const donationsAPI = {
  getAll: async () => await fetchAPI('/donations'),
  create: async (data) => await fetchAPI('/donations', 'POST', data),
  update: async (data) => await fetchAPI('/donations', 'POST', data),
  delete: async (id) => await fetchAPI(`/donations/${id}`, 'DELETE')
};

// Expenses API
const expensesAPI = {
  getAll: async () => await fetchAPI('/expenses'),
  create: async (data) => await fetchAPI('/expenses', 'POST', data),
  update: async (data) => await fetchAPI('/expenses', 'POST', data),
  delete: async (id) => await fetchAPI(`/expenses/${id}`, 'DELETE')
};

// Experiences API
const experiencesAPI = {
  getAll: async () => await fetchAPI('/experiences'),
  create: async (data) => await fetchAPI('/experiences', 'POST', data),
  update: async (data) => await fetchAPI('/experiences', 'POST', data),
  delete: async (id) => await fetchAPI(`/experiences/${id}`, 'DELETE')
};

// Weekly Fees API
const weeklyFeesAPI = {
  getAll: async () => await fetchAPI('/weekly-fees'),
  getMemberFees: async (memberId) => await fetchAPI(`/weekly-fees/${memberId}`),
  addPayment: async (memberId, data) => await fetchAPI(`/weekly-fees/${memberId}`, 'POST', data),
  updatePayment: async (memberId, paymentId, data) => await fetchAPI(`/weekly-fees/${memberId}/${paymentId}`, 'PUT', data),
  deletePayment: async (memberId, paymentId) => await fetchAPI(`/weekly-fees/${memberId}/${paymentId}`, 'DELETE')
};

// Gallery API
const galleryAPI = {
  getAll: async () => await fetchAPI('/gallery'),
  getTop5: async () => await fetchAPI('/gallery/top5'),
  create: async (data) => await fetchAPI('/gallery', 'POST', data),
  update: async (data) => await fetchAPI('/gallery', 'POST', data),
  toggleTop5: async (id) => await fetchAPI(`/gallery/toggle-top5/${id}`, 'PUT'),
  updateOrder: async (items) => await fetchAPI('/gallery/update-order', 'PUT', { items }),
  delete: async (id) => await fetchAPI(`/gallery/${id}`, 'DELETE')
};

// Load all data from API
async function loadAllData() {
  try {
    showMessage('Loading data from server...', 'info');
    
    // First check if the server is available and initialize sync status
    let serverAvailable = false;
    try {
      // Make a simple request to check server connectivity
      await fetch('/api/health-check').then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        serverAvailable = true;
      });
    } catch (connectionError) {
      // If we can't connect to the server at all or get a server error
      console.error('Server connection error:', connectionError);
      
      // Check if it's a 404 (which means server is running but endpoint doesn't exist)
      if (connectionError.message.includes('404')) {
        // Server is running but the health-check endpoint doesn't exist
        // This is expected, so we can continue
        console.log('Server is running, continuing with data load');
        serverAvailable = true;
      } else {
        // For other errors, show a more specific message
        showMessage('Cannot connect to server. MongoDB connection may not be configured. Check README.md for setup instructions.', 'error');
        return false;
      }
    }
    
    // Load all data in parallel
    const [
      heroSlides,
      activities,
      members,
      donations,
      expenses,
      experiences,
      weeklyFees,
      gallery
    ] = await Promise.all([
      heroSlidesAPI.getAll(),
      activitiesAPI.getAll(),
      membersAPI.getAll(),
      donationsAPI.getAll(),
      expensesAPI.getAll(),
      experiencesAPI.getAll(),
      weeklyFeesAPI.getAll(),
      galleryAPI.getAll()
    ]);
    
    // Update appData with fetched data
    appData.heroSlides = heroSlides;
    appData.activities = activities;
    appData.members = members;
    appData.donations = donations;
    appData.expenses = expenses;
    appData.experiences = experiences;
    appData.weeklyFees = weeklyFees;
    appData.gallery = gallery;
    
    // Calculate dashboard stats
    updateDashboardStats();
    
    // Re-render all components
    renderAllComponents();
    
    // Initialize sync system with server status
    if (typeof syncData === 'function') {
      syncData(serverAvailable);
    }
    
    showMessage('Data loaded successfully', 'success');
    return true;
  } catch (error) {
    console.error('Failed to load data:', error);
    
    // Provide a more helpful error message based on the error type
    if (error.message.includes('404')) {
      showMessage('API endpoint not found. Please make sure the server is running and MongoDB is properly configured. See README.md for setup instructions.', 'error');
    } else if (error.message.includes('Failed to fetch')) {
      showMessage('Network error. Please check your internet connection or server status.', 'error');
    } else {
      showMessage('Failed to load data from server. Using sample data instead.', 'error');
    }
    
    return false;
  }
}

// Update dashboard statistics based on current data
function updateDashboardStats() {
  // Calculate totals
  const totalMembers = appData.members.length;
  const totalActivities = appData.activities.length;
  
  let totalDonations = 0;
  appData.donations.forEach(donation => {
    totalDonations += donation.amount;
  });
  
  let totalExpenses = 0;
  appData.expenses.forEach(expense => {
    totalExpenses += expense.amount;
  });
  
  const netBalance = totalDonations - totalExpenses;
  
  // Calculate weekly fees statistics
  let weeklyFeesCollected = 0;
  let pendingFees = 0;
  let overdueFees = 0;
  
  appData.weeklyFees.forEach(memberFee => {
    memberFee.payments.forEach(payment => {
      if (payment.status === 'paid') {
        weeklyFeesCollected += payment.amount;
      } else if (payment.status === 'pending') {
        pendingFees += payment.amount;
      } else if (payment.status === 'overdue') {
        overdueFees += payment.amount;
      }
    });
  });
  
  // Update dashboard stats
  appData.dashboardStats = {
    totalMembers,
    totalActivities,
    totalDonations,
    totalExpenses,
    netBalance,
    weeklyFeesCollected,
    pendingFees,
    overdueFees,
    totalExperiences: appData.experiences.length
  };
}

// Re-render all components after data update
function renderAllComponents() {
  renderHeroSlideshow();
  renderHeroManagement();
  renderHomeEvents();
  renderDashboard();
  renderActivities();
  renderMembers();
  renderDonations();
  renderExpenses();
  renderExperiences();
  renderWeeklyFees();
  renderGallery();
  updateTotalDonations();
  updateTotalExpenses();
  renderRecentActivities();
}