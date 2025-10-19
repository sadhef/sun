const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  civilId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  specializations: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    enum: ['English', 'Arabic', 'Tamil', 'Mandarin', 'Spanish', 'Hindi',
           'Japanese', 'French', 'Italian', 'Russian', 'Korean', 'German',
           'Portuguese', 'Cantonese', 'Urdu', 'Malayalam'],
    default: 'English'
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date
  }],
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0
  },
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

TrainerSchema.index({ name: 1, status: 1 });
TrainerSchema.index({ email: 1 });
TrainerSchema.index({ specializations: 1 });

module.exports = mongoose.model('Trainer', TrainerSchema);
