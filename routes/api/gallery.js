const express = require('express');
const router = express.Router();
const Gallery = require('../../models/Gallery');
const HeroSlide = require('../../models/HeroSlide');

// @route   GET api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gallery/top5
// @desc    Get top 5 gallery items
// @access  Public
router.get('/top5', async (req, res) => {
  try {
    const top5Items = await Gallery.find({ isTop5: true }).sort({ top5Order: 1 });
    res.json(top5Items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/gallery
// @desc    Create or update a gallery item
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      imageUrl, 
      isTop5, 
      top5Order,
      _id 
    } = req.body;

    const galleryFields = {
      title,
      description,
      imageUrl,
      isTop5: isTop5 || false,
      top5Order: top5Order || 0
    };

    let galleryItem;

    if (_id) {
      // Update
      galleryItem = await Gallery.findByIdAndUpdate(
        _id,
        { $set: galleryFields },
        { new: true }
      );
    } else {
      // Create
      galleryItem = new Gallery(galleryFields);
      await galleryItem.save();
    }

    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/gallery/toggle-top5/:id
// @desc    Toggle isTop5 status for a gallery item
// @access  Public
router.put('/toggle-top5/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    // Toggle isTop5 status
    galleryItem.isTop5 = !galleryItem.isTop5;
    
    // If adding to top5, set order to the end
    if (galleryItem.isTop5) {
      const top5Count = await Gallery.countDocuments({ isTop5: true });
      galleryItem.top5Order = top5Count + 1;
    } else {
      // If removing from top5, reorder other items
      const removedOrder = galleryItem.top5Order;
      await Gallery.updateMany(
        { isTop5: true, top5Order: { $gt: removedOrder } },
        { $inc: { top5Order: -1 } }
      );
      galleryItem.top5Order = 0;
    }
    
    await galleryItem.save();
    
    // Update hero slides based on top5 gallery items
    await updateHeroSlidesFromGallery();
    
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/gallery/update-order
// @desc    Update the order of top5 gallery items
// @access  Public
router.put('/update-order', async (req, res) => {
  try {
    const { items } = req.body;
    
    // Update each item's order
    for (const item of items) {
      await Gallery.findByIdAndUpdate(
        item._id,
        { $set: { top5Order: item.top5Order } }
      );
    }
    
    // Update hero slides based on top5 gallery items
    await updateHeroSlidesFromGallery();
    
    res.json({ msg: 'Order updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/gallery/:id
// @desc    Delete a gallery item
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    // If it's a top5 item, reorder other items
    if (galleryItem.isTop5) {
      const removedOrder = galleryItem.top5Order;
      await Gallery.updateMany(
        { isTop5: true, top5Order: { $gt: removedOrder } },
        { $inc: { top5Order: -1 } }
      );
    }
    
    await Gallery.findByIdAndRemove(req.params.id);
    
    // Update hero slides based on top5 gallery items
    await updateHeroSlidesFromGallery();
    
    res.json({ msg: 'Gallery item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to update hero slides from gallery
async function updateHeroSlidesFromGallery() {
  try {
    // Get top 5 gallery items
    const top5Items = await Gallery.find({ isTop5: true }).sort({ top5Order: 1 });
    
    // Delete all existing hero slides
    await HeroSlide.deleteMany({});
    
    // Create hero slides from top 5 gallery items
    for (const item of top5Items) {
      const heroSlide = new HeroSlide({
        title: item.title,
        subtitle: 'Ledo Sports Academy',
        description: item.description || 'Join us for exciting sports activities',
        backgroundImage: item.imageUrl,
        ctaText: 'Learn More',
        ctaLink: '#activities',
        redirectUrl: '',
        openNewTab: false
      });
      
      await heroSlide.save();
    }
  } catch (err) {
    console.error('Error updating hero slides from gallery:', err.message);
  }
}

module.exports = router;