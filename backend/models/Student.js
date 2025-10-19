const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  civilId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  language: {
    type: String,
    enum: ['English', 'Arabic', 'Hindi', 'Urdu', 'Bengali', 'Filipino'],
    default: 'English'
  },
  dateOfBirth: {
    type: Date
  },
  nationality: {
    type: String,
    trim: true
  },
  coursesCompleted: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    courseName: String,
    completionDate: Date,
    result: String,
    batchId: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

StudentSchema.index({ civilId: 1 }, { unique: true });
StudentSchema.index({ name: 1 });
StudentSchema.index({ email: 1 });

module.exports = mongoose.model('Student', StudentSchema);
