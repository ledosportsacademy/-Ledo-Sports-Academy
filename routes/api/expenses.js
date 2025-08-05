const express = require('express');
const router = express.Router();
const Expense = require('../../models/Expense');

// @route   GET api/expenses
// @desc    Get all expenses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/expenses
// @desc    Create or update an expense
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      description, 
      amount, 
      date, 
      category, 
      vendor, 
      paymentMethod,
      _id 
    } = req.body;

    const expenseFields = {
      description,
      amount,
      date,
      category,
      vendor,
      paymentMethod
    };

    let expense;

    if (_id) {
      // Update
      expense = await Expense.findByIdAndUpdate(
        _id,
        { $set: expenseFields },
        { new: true }
      );
    } else {
      // Create
      expense = new Expense(expenseFields);
      await expense.save();
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;