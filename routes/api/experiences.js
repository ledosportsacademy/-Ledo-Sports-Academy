const express = require('express');
const router = express.Router();
const Experience = require('../../models/Experience');

// @route   GET api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ date: -1 });
    res.json(experiences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/experiences
// @desc    Create or update an experience
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      date, 
      description, 
      image,
      _id 
    } = req.body;

    const experienceFields = {
      title,
      date,
      description,
      image
    };

    let experience;

    if (_id) {
      // Update
      experience = await Experience.findByIdAndUpdate(
        _id,
        { $set: experienceFields },
        { new: true }
      );
    } else {
      // Create
      experience = new Experience(experienceFields);
      await experience.save();
    }

    res.json(experience);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/experiences/:id
// @desc    Delete an experience
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    await Experience.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Experience removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;