const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  enquiry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry',
    required: true
  },
  enquiryId: {
    type: String,
    required: true,
    index: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  civilId: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  completionDate: {
    type: Date,
    required: true
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  expiryDate: {
    type: Date
  },
  grade: {
    type: String,
    enum: ['Pass', 'Fail', 'Distinction', 'Merit', 'N/A'],
    default: 'Pass'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  trainerName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Issued', 'Revoked', 'Expired'],
    default: 'Pending',
    index: true
  },
  pdfUrl: {
    type: String
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  verificationCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

CertificateSchema.index({ student: 1, course: 1 });
CertificateSchema.index({ issueDate: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);
