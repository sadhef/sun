const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  leaveId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
    index: true
  },
  trainerName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Sick Leave', 'Annual Leave', 'Unpaid Leave', 'Emergency', 'Other'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

LeaveSchema.index({ trainer: 1, status: 1 });
LeaveSchema.index({ startDate: 1, endDate: 1 });

// Calculate number of days
LeaveSchema.virtual('numberOfDays').get(function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
});

module.exports = mongoose.model('Leave', LeaveSchema);
