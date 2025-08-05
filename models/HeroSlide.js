const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  backgroundImage: {
    type: String,
    required: true
  },
  ctaText: {
    type: String,
    required: true
  },
  ctaLink: {
    type: String,
    required: true
  },
  redirectUrl: {
    type: String,
    default: ''
  },
  openNewTab: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);