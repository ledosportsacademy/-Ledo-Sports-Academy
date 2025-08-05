// Data Synchronization Functions for Ledo Sports Academy

// Variable to store the interval ID for periodic sync
let syncIntervalId = null;

// Function to check for unsynchronized items
function checkUnsyncedItems() {
  let unsyncedCount = 0;
  
  // Check all data types for items marked as needing sync
  if (appData.gallery) {
    unsyncedCount += appData.gallery.filter(item => item.needsSync).length;
  }
  
  // Add checks for other data types as needed
  
  return unsyncedCount;
}

// Function to start periodic synchronization
function startPeriodicSync(intervalMinutes = 5) {
  // Clear any existing interval
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
  }
  
  // Convert minutes to milliseconds
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Set up new interval
  syncIntervalId = setInterval(() => {
    console.log('Running periodic data synchronization...');
    
    // Check for unsynced items before syncing
    const unsyncedBefore = checkUnsyncedItems();
    
    syncData().then(success => {
      if (success) {
        console.log('Periodic sync completed successfully');
        
        // Check if we had unsynced items that are now synced
        const unsyncedAfter = checkUnsyncedItems();
        if (unsyncedBefore > 0 && unsyncedAfter < unsyncedBefore) {
          showMessage(`Successfully synchronized ${unsyncedBefore - unsyncedAfter} previously unsynced items`, 'success');
        }
      } else {
        console.warn('Periodic sync failed, some changes may not be saved to server');
        
        // Check if we still have unsynced items
        const unsyncedAfter = checkUnsyncedItems();
        if (unsyncedAfter > 0) {
          showMessage(`${unsyncedAfter} items still need to be synchronized with the server. Will retry later.`, 'warning');
        }
      }
    });
  }, intervalMs);
  
  console.log(`Periodic sync started, will run every ${intervalMinutes} minutes`);
  return true;
}

// Function to stop periodic synchronization
function stopPeriodicSync() {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
    console.log('Periodic sync stopped');
    return true;
  }
  return false;
}

// Function to synchronize all data changes with the server
async function syncData() {
  try {
    showMessage('Synchronizing data with server...', 'info');
    
    // First check if the server is available
    try {
      // Make a simple request to check server connectivity
      const response = await fetch('/api/health-check');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Check MongoDB connection status from health check response
      const healthData = await response.json();
      if (healthData.database !== 'connected') {
        throw new Error(`Database not connected: ${healthData.dbState}`);
      }
    } catch (connectionError) {
      // If we can't connect to the server at all or get a server error
      console.error('Server connection error:', connectionError);
      showMessage('Cannot connect to server. Changes will only be saved locally.', 'error');
      return false;
    }
    
    // Synchronize all data types
    const syncPromises = [];
    
    // Sync hero slides
    appData.heroSlides.forEach(slide => {
      syncPromises.push(syncHeroSlide(slide));
    });
    
    // Sync activities
    appData.activities.forEach(activity => {
      syncPromises.push(syncActivity(activity));
    });
    
    // Sync members
    appData.members.forEach(member => {
      syncPromises.push(syncMember(member));
    });
    
    // Sync weekly fees
    appData.weeklyFees.forEach(weeklyFee => {
      syncPromises.push(syncWeeklyFee(weeklyFee));
    });
    
    // Sync donations
    appData.donations.forEach(donation => {
      syncPromises.push(syncDonation(donation));
    });
    
    // Sync expenses
    appData.expenses.forEach(expense => {
      syncPromises.push(syncExpense(expense));
    });
    
    // Sync experiences
    appData.experiences.forEach(experience => {
      syncPromises.push(syncExperience(experience));
    });
    
    // Sync gallery items - prioritize items that need sync
    appData.gallery.forEach(item => {
      // Prioritize items that were marked as needing sync
      if (item.needsSync) {
        console.log('Prioritizing sync for previously failed item:', item.id);
        // Add with higher priority (at the beginning of the array)
        syncPromises.unshift(syncGalleryItem(item).then(success => {
          if (success) {
            // Clear the needsSync flag if successful
            delete item.needsSync;
            console.log('Successfully synced previously failed item:', item.id);
          }
          return success;
        }));
      } else {
        syncPromises.push(syncGalleryItem(item));
      }
    });
    
    // Wait for all sync operations to complete
    await Promise.all(syncPromises);
    
    showMessage('Data synchronized successfully', 'success');
    return true;
  } catch (error) {
    console.error('Failed to synchronize data:', error);
    showMessage('Failed to synchronize data with server. Changes will only be saved locally.', 'error');
    return false;
  }
}

// Hero Slides Synchronization
async function syncHeroSlide(slide, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = slide._id || slide.id;
      await heroSlidesAPI.delete(idToDelete);
    } else if (slide._id) {
      // For update operations, ensure we're using the MongoDB _id
      await heroSlidesAPI.update(slide);
    } else {
      // For create operations
      const result = await heroSlidesAPI.create(slide);
      // Update the local slide with the MongoDB _id for future operations
      if (result && result._id) {
        slide._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync hero slide:', error);
    return false;
  }
}

// Activities Synchronization
async function syncActivity(activity, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = activity._id || activity.id;
      await activitiesAPI.delete(idToDelete);
    } else if (activity._id) {
      // For update operations, ensure we're using the MongoDB _id
      await activitiesAPI.update(activity);
    } else {
      // For create operations
      const result = await activitiesAPI.create(activity);
      // Update the local activity with the MongoDB _id for future operations
      if (result && result._id) {
        activity._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync activity:', error);
    return false;
  }
}

// Members Synchronization
async function syncMember(member, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = member._id || member.id;
      await membersAPI.delete(idToDelete);
    } else if (member._id) {
      // For update operations, ensure we're using the MongoDB _id
      await membersAPI.update(member);
    } else {
      // For create operations
      const result = await membersAPI.create(member);
      // Update the local member with the MongoDB _id for future operations
      if (result && result._id) {
        member._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync member:', error);
    return false;
  }
}

// Donations Synchronization
async function syncDonation(donation, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = donation._id || donation.id;
      await donationsAPI.delete(idToDelete);
    } else if (donation._id) {
      // For update operations, ensure we're using the MongoDB _id
      await donationsAPI.update(donation);
    } else {
      // For create operations
      const result = await donationsAPI.create(donation);
      // Update the local donation with the MongoDB _id for future operations
      if (result && result._id) {
        donation._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync donation:', error);
    return false;
  }
}

// Expenses Synchronization
async function syncExpense(expense, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = expense._id || expense.id;
      await expensesAPI.delete(idToDelete);
    } else if (expense._id) {
      // For update operations, ensure we're using the MongoDB _id
      await expensesAPI.update(expense);
    } else {
      // For create operations
      const result = await expensesAPI.create(expense);
      // Update the local expense with the MongoDB _id for future operations
      if (result && result._id) {
        expense._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync expense:', error);
    return false;
  }
}

// Experiences Synchronization
async function syncExperience(experience, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = experience._id || experience.id;
      await experiencesAPI.delete(idToDelete);
    } else if (experience._id) {
      // For update operations, ensure we're using the MongoDB _id
      await experiencesAPI.update(experience);
    } else {
      // For create operations
      const result = await experiencesAPI.create(experience);
      // Update the local experience with the MongoDB _id for future operations
      if (result && result._id) {
        experience._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync experience:', error);
    return false;
  }
}

// Gallery Synchronization
async function syncGalleryItem(item, isDelete = false) {
  const maxRetries = 3;
  let retryCount = 0;
  let success = false;
  
  while (retryCount < maxRetries && !success) {
    try {
      if (isDelete) {
        // For delete operations, we need to use the MongoDB _id if available
        const idToDelete = item._id || item.id;
        await galleryAPI.delete(idToDelete);
      } else if (item._id) {
        // For update operations, ensure we're using the MongoDB _id
        await galleryAPI.update(item);
      } else {
        // For create operations
        const result = await galleryAPI.create(item);
        // Update the local item with the MongoDB _id for future operations
        if (result && result._id) {
          item._id = result._id;
        }
      }
      success = true;
      return true;
    } catch (error) {
      retryCount++;
      console.error(`Failed to sync gallery item (attempt ${retryCount}/${maxRetries}):`, error);
      
      if (retryCount < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        console.log(`Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  return success;
}

// Toggle Top 5 Status Synchronization
async function syncToggleTop5(photoId) {
  try {
    // Find the photo in the gallery to get its MongoDB _id if available
    const photo = appData.gallery.find(p => p.id === photoId);
    const idToToggle = photo && photo._id ? photo._id : photoId;
    
    await galleryAPI.toggleTop5(idToToggle);
    return true;
  } catch (error) {
    console.error('Failed to sync top 5 status:', error);
    return false;
  }
}

// Update Top 5 Order Synchronization
async function syncUpdateTop5Order(items) {
  try {
    // Ensure we're using MongoDB _id for each item
    const itemsToSync = items.map(item => {
      // Create a new object with the necessary properties
      return {
        _id: item._id || item.id, // Use MongoDB _id if available, otherwise use client id
        top5Order: item.order || 0 // Use the client-side order property
      };
    });
    
    await galleryAPI.updateOrder(itemsToSync);
    return true;
  } catch (error) {
    console.error('Failed to sync top 5 order:', error);
    return false;
  }
}

// Weekly Fees Synchronization
async function syncWeeklyFee(weeklyFee, isDelete = false) {
  try {
    if (isDelete) {
      // For delete operations, we need to use the MongoDB _id if available
      const idToDelete = weeklyFee._id || weeklyFee.memberId;
      await weeklyFeesAPI.deletePayment(idToDelete, weeklyFee.paymentId);
    } else if (weeklyFee._id) {
      // For update operations, ensure we're using the MongoDB _id
      if (weeklyFee.paymentId) {
        // Update specific payment
        await weeklyFeesAPI.updatePayment(weeklyFee._id, weeklyFee.paymentId, weeklyFee);
      } else {
        // Add new payment
        await weeklyFeesAPI.addPayment(weeklyFee._id, weeklyFee);
      }
    } else {
      // For create operations of new weekly fee record
      const result = await weeklyFeesAPI.addPayment(weeklyFee.memberId, {
        date: weeklyFee.payments[0].date,
        amount: weeklyFee.payments[0].amount,
        status: weeklyFee.payments[0].status
      });
      // Update the local weekly fee with the MongoDB _id for future operations
      if (result && result._id) {
        weeklyFee._id = result._id;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to sync weekly fee:', error);
    return false;
  }
}