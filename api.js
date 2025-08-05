// API functions for Ledo Sports Academy

// Base API URL
const API_URL = '';

// Generic fetch function with error handling and retry logic
async function fetchAPI(endpoint, method = 'GET', data = null, retries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        // Add cache control to prevent caching issues
        cache: 'no-cache',
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000) // 30 second timeout
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
      lastError = error;
      console.error(`API Request Failed (attempt ${attempt + 1}/${retries}):`, error);
      
      // Only show message on final attempt to avoid spamming the user
      if (attempt === retries - 1) {
        showMessage(`API Request Failed: ${error.message}. Check your network connection.`, 'error');
      } else {
        console.log(`Retrying in ${Math.pow(2, attempt)} seconds...`);
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
}

// Hero Slides API
const heroSlidesAPI = {
  getAll: async () => await fetchAPI('/api/hero-slides'),
  create: async (data) => await fetchAPI('/api/hero-slides', 'POST', data),
  update: async (data) => await fetchAPI('/api/hero-slides', 'POST', data),
  delete: async (id) => await fetchAPI(`/api/hero-slides/${id}`, 'DELETE')
};

// Activities API
const activitiesAPI = {
  getAll: async () => await fetchAPI('/api/activities'),
  create: async (data) => await fetchAPI('/api/activities', 'POST', data),
  update: async (data) => await fetchAPI('/api/activities', 'POST', data),
  delete: async (id) => await fetchAPI(`/api/activities/${id}`, 'DELETE')
};

// Members API
const membersAPI = {
  getAll: async () => await fetchAPI('/api/members'),
  create: async (data) => await fetchAPI('/api/members', 'POST', data),
  update: async (data) => await fetchAPI('/api/members', 'POST', data),
  delete: async (id) => await fetchAPI(`/api/members/${id}`, 'DELETE')
};

// Donations API
const donationsAPI = {
  getAll: async () => await fetchAPI('/api/donations'),
  create: async (data) => await fetchAPI('/api/donations', 'POST', data),
  update: async (data) => await fetchAPI('/api/donations', 'POST', data),
  delete: async (id) => await fetchAPI(`/api/donations/${id}`, 'DELETE')
};

// Expenses API
const expensesAPI = {
  getAll: async () => await fetchAPI('/api/expenses'),
  create: async (data) => await fetchAPI('/api/expenses', 'POST', data),
  update: async (data) => await fetchAPI('/api/expenses', 'POST', data),
  delete: async (id) => await fetchAPI(`/api/expenses/${id}`, 'DELETE')
};

// Experiences API
const experiencesAPI = {
  getAll: async () => await fetchAPI('/api/experiences'),
  create: async (data) => await fetchAPI('/api/experiences', 'POST', data),
  update: async (data) => await fetchAPI('/api/experiences', 'POST', data),
  delete: async (id) => await fetchAPI(`/api/experiences/${id}`, 'DELETE')
};

// Weekly Fees API
const weeklyFeesAPI = {
  getAll: async () => await fetchAPI('/api/weekly-fees'),
  getMemberFees: async (memberId) => await fetchAPI(`/api/weekly-fees/${memberId}`),
  addPayment: async (memberId, data) => await fetchAPI(`/api/weekly-fees/${memberId}`, 'POST', data),
  updatePayment: async (memberId, paymentId, data) => await fetchAPI(`/api/weekly-fees/${memberId}/${paymentId}`, 'PUT', data),
  deletePayment: async (memberId, paymentId) => await fetchAPI(`/api/weekly-fees/${memberId}/${paymentId}`, 'DELETE')
};

// Gallery API
const galleryAPI = {
  getAll: async () => await fetchAPI('/api/gallery'),
  getTop5: async () => await fetchAPI('/api/gallery/top5'),
  create: async (data) => await fetchAPI('/api/gallery', 'POST', data),
  update: async (data) => await fetchAPI('/api/gallery', 'POST', data),
  toggleTop5: async (id) => await fetchAPI(`/api/gallery/toggle-top5/${id}`, 'PUT'),
  updateOrder: async (items) => await fetchAPI('/api/gallery/update-order', 'PUT', { items }),
  delete: async (id) => await fetchAPI(`/api/gallery/${id}`, 'DELETE')
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
      // Perform initial sync to ensure all data is properly synchronized
      setTimeout(() => {
        syncData().then(syncSuccess => {
          if (syncSuccess) {
            console.log('Initial data synchronization successful');
            
            // Start periodic sync if available
            if (typeof startPeriodicSync === 'function') {
              startPeriodicSync(3); // Sync every 3 minutes
              console.log('Periodic sync started');
            }
          } else {
            console.warn('Initial data synchronization failed, changes may not persist after reload');
            
            // Still start periodic sync to try again later
            if (typeof startPeriodicSync === 'function') {
              startPeriodicSync(2); // Try more frequently (every 2 minutes) if initial sync failed
              console.log('Periodic sync started with shorter interval due to initial sync failure');
            }
          }
        });
      }, 2000); // Delay initial sync to ensure UI is fully loaded
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