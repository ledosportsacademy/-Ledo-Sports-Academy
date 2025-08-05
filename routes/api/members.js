const express = require('express');
const router = express.Router();
const Member = require('../../models/Member');
const WeeklyFee = require('../../models/WeeklyFee');

// @route   GET api/members
// @desc    Get all members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/members
// @desc    Create or update a member
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      contact, 
      phone, 
      joinDate, 
      role, 
      image,
      _id 
    } = req.body;

    const memberFields = {
      name,
      contact,
      phone,
      joinDate,
      role,
      image
    };

    let member;

    if (_id) {
      // Update
      member = await Member.findByIdAndUpdate(
        _id,
        { $set: memberFields },
        { new: true }
      );
    } else {
      // Create
      member = new Member(memberFields);
      await member.save();
      
      // Create weekly fee record for new member
      const weeklyFee = new WeeklyFee({
        memberId: member._id,
        memberName: member.name,
        payments: []
      });
      await weeklyFee.save();
    }

    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/members/:id
// @desc    Delete a member
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    // Remove member's weekly fee record
    await WeeklyFee.findOneAndRemove({ memberId: req.params.id });
    
    // Remove member
    await Member.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;