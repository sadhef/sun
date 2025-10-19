const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPosition: {
    type: String,
    trim: true
  }
}, { _id: false });

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['company', 'individual'],
    default: 'company'
  },
  contact: ContactSchema,
  governmentDocument: {
    filename: String,
    fileUrl: String,
    uploadDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

ClientSchema.index({ name: 1, type: 1 });
ClientSchema.index({ 'contact.contactEmail': 1 });

module.exports = mongoose.model('Client', ClientSchema);
