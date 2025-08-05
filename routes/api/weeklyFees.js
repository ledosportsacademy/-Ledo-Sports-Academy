const express = require('express');
const router = express.Router();
const WeeklyFee = require('../../models/WeeklyFee');

// @route   GET api/weekly-fees
// @desc    Get all weekly fees
// @access  Public
router.get('/', async (req, res) => {
  try {
    const weeklyFees = await WeeklyFee.find().sort({ 'memberName': 1 });
    res.json(weeklyFees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weekly-fees/:memberId
// @desc    Get weekly fees for a specific member
// @access  Public
router.get('/:memberId', async (req, res) => {
  try {
    const weeklyFee = await WeeklyFee.findOne({ memberId: req.params.memberId });
    
    if (!weeklyFee) {
      return res.status(404).json({ msg: 'Weekly fee record not found' });
    }
    
    res.json(weeklyFee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/weekly-fees/:memberId
// @desc    Add a payment to a member's weekly fee record
// @access  Public
router.post('/:memberId', async (req, res) => {
  try {
    const { date, amount, status } = req.body;
    
    const weeklyFee = await WeeklyFee.findOne({ memberId: req.params.memberId });
    
    if (!weeklyFee) {
      return res.status(404).json({ msg: 'Weekly fee record not found' });
    }
    
    const newPayment = {
      date,
      amount,
      status: status || 'paid'
    };
    
    weeklyFee.payments.push(newPayment);
    await weeklyFee.save();
    
    res.json(weeklyFee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/weekly-fees/:memberId/:paymentId
// @desc    Update a payment in a member's weekly fee record
// @access  Public
router.put('/:memberId/:paymentId', async (req, res) => {
  try {
    const { date, amount, status } = req.body;
    
    const weeklyFee = await WeeklyFee.findOne({ memberId: req.params.memberId });
    
    if (!weeklyFee) {
      return res.status(404).json({ msg: 'Weekly fee record not found' });
    }
    
    // Find the payment index
    const paymentIndex = weeklyFee.payments.findIndex(
      payment => payment._id.toString() === req.params.paymentId
    );
    
    if (paymentIndex === -1) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // Update the payment
    weeklyFee.payments[paymentIndex].date = date;
    weeklyFee.payments[paymentIndex].amount = amount;
    weeklyFee.payments[paymentIndex].status = status;
    
    await weeklyFee.save();
    
    res.json(weeklyFee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/weekly-fees/:memberId/:paymentId
// @desc    Delete a payment from a member's weekly fee record
// @access  Public
router.delete('/:memberId/:paymentId', async (req, res) => {
  try {
    const weeklyFee = await WeeklyFee.findOne({ memberId: req.params.memberId });
    
    if (!weeklyFee) {
      return res.status(404).json({ msg: 'Weekly fee record not found' });
    }
    
    // Filter out the payment to remove
    weeklyFee.payments = weeklyFee.payments.filter(
      payment => payment._id.toString() !== req.params.paymentId
    );
    
    await weeklyFee.save();
    
    res.json(weeklyFee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;