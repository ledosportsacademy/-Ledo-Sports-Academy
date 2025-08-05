const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  isTop5: {
    type: Boolean,
    default: false
  },
  top5Order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);