const express = require('express');
const router = express.Router();
const Activity = require('../../models/Activity');

// @route   GET api/activities
// @desc    Get all activities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/activities
// @desc    Create or update an activity
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      date, 
      time, 
      description, 
      image, 
      status, 
      type, 
      priority, 
      redirectUrl, 
      openNewTab,
      _id 
    } = req.body;

    const activityFields = {
      title,
      date,
      time,
      description,
      image,
      status,
      type,
      priority,
      redirectUrl,
      openNewTab
    };

    let activity;

    if (_id) {
      // Update
      activity = await Activity.findByIdAndUpdate(
        _id,
        { $set: activityFields },
        { new: true }
      );
    } else {
      // Create
      activity = new Activity(activityFields);
      await activity.save();
    }

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/activities/:id
// @desc    Delete an activity
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    await Activity.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;