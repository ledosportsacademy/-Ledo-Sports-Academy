const express = require('express');
const router = express.Router();
const Donation = require('../../models/Donation');

// @route   GET api/donations
// @desc    Get all donations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/donations
// @desc    Create or update a donation
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      donorName, 
      amount, 
      date, 
      purpose,
      _id 
    } = req.body;

    const donationFields = {
      donorName,
      amount,
      date,
      purpose
    };

    let donation;

    if (_id) {
      // Update
      donation = await Donation.findByIdAndUpdate(
        _id,
        { $set: donationFields },
        { new: true }
      );
    } else {
      // Create
      donation = new Donation(donationFields);
      await donation.save();
    }

    res.json(donation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/donations/:id
// @desc    Delete a donation
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    await Donation.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Donation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;