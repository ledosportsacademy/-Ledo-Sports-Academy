const express = require('express');
const router = express.Router();
const HeroSlide = require('../../models/HeroSlide');

// @route   GET api/hero-slides
// @desc    Get all hero slides
// @access  Public
router.get('/', async (req, res) => {
  try {
    const heroSlides = await HeroSlide.find().sort({ createdAt: -1 });
    res.json(heroSlides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/hero-slides
// @desc    Create or update a hero slide
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      subtitle, 
      description, 
      backgroundImage, 
      ctaText, 
      ctaLink, 
      redirectUrl, 
      openNewTab,
      _id 
    } = req.body;

    const slideFields = {
      title,
      subtitle,
      description,
      backgroundImage,
      ctaText,
      ctaLink,
      redirectUrl,
      openNewTab
    };

    let heroSlide;

    if (_id) {
      // Update
      heroSlide = await HeroSlide.findByIdAndUpdate(
        _id,
        { $set: slideFields },
        { new: true }
      );
    } else {
      // Create
      heroSlide = new HeroSlide(slideFields);
      await heroSlide.save();
    }

    res.json(heroSlide);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/hero-slides/:id
// @desc    Delete a hero slide
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Hero slide removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;