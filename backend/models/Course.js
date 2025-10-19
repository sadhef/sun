const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    trim: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    hours: {
      type: Number,
      min: 1
    },
    days: {
      type: Number,
      min: 1
    }
  },
  classCapacity: {
    type: Number,
    default: 15,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    trim: true
  },
  prerequisites: [{
    type: String
  }]
}, {
  timestamps: true
});

CourseSchema.index({ isActive: 1 });

module.exports = mongoose.model('Course', CourseSchema);
