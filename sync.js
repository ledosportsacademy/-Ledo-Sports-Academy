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
      await heroSlidesAPI.delete(slide.id);
    } else if (slide._id) {
      await heroSlidesAPI.update(slide);
    } else {
      await heroSlidesAPI.create(slide);
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
      await activitiesAPI.delete(activity.id);
    } else if (activity._id) {
      await activitiesAPI.update(activity);
    } else {
      await activitiesAPI.create(activity);
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
      await membersAPI.delete(member.id);
    } else if (member._id) {
      await membersAPI.update(member);
    } else {
      await membersAPI.create(member);
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
      await donationsAPI.delete(donation.id);
    } else if (donation._id) {
      await donationsAPI.update(donation);
    } else {
      await donationsAPI.create(donation);
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
      await expensesAPI.delete(expense.id);
    } else if (expense._id) {
      await expensesAPI.update(expense);
    } else {
      await expensesAPI.create(expense);
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
      await experiencesAPI.delete(experience.id);
    } else if (experience._id) {
      await experiencesAPI.update(experience);
    } else {
      await experiencesAPI.create(experience);
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
      await galleryAPI.delete(item.id);
    } else if (item._id) {
      await galleryAPI.update(item);
    } else {
      await galleryAPI.create(item);
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
    await galleryAPI.toggleTop5(photoId);
    return true;
  } catch (error) {
    console.error('Failed to sync top 5 status:', error);
    return false;
  }
}

// Update Top 5 Order Synchronization
async function syncUpdateTop5Order(items) {
  try {
    await galleryAPI.updateOrder(items);
    return true;
  } catch (error) {
    console.error('Failed to sync top 5 order:', error);
    return false;
  }
}