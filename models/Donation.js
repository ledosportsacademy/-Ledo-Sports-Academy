const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);