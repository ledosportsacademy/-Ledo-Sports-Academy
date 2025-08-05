// Data Synchronization Functions for Ledo Sports Academy

// Function to synchronize all data changes with the server
async function syncData() {
  try {
    showMessage('Synchronizing data with server...', 'info');
    
    // First check if the server is available
    try {
      // Make a simple request to check server connectivity
      await fetch('/api/health-check').then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
      });
    } catch (connectionError) {
      // If we can't connect to the server at all or get a server error
      console.error('Server connection error:', connectionError);
      showMessage('Cannot connect to server. Changes will only be saved locally.', 'error');
      return false;
    }
    
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
    return true;
  } catch (error) {
    console.error('Failed to sync gallery item:', error);
    return false;
  }
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