const mongoose = require('mongoose');

const NomineeSchema = new mongoose.Schema({
  civilId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  result: {
    type: String,
    enum: ['Pass', 'Fail', ''],
    default: ''
  },
  time: String,
  notes: String
}, { _id: false });

const ActivityLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    trim: true
  }
}, { _id: false });

const NoteSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    trim: true
  }
}, { _id: false });

const EnquirySchema = new mongoose.Schema({
  enquiryId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  client: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  clientRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
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
  course: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  requested: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  nominated: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
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
  status: {
    type: String,
    enum: [
      'Draft',
      'Quotation Sent',
      'Agreement Pending',
      'Agreement Sent',
      'Pending Nomination',
      'Nominated',
      'Scheduled',
      'Completed',
      'Cancelled'
    ],
    default: 'Draft',
    required: true,
    index: true
  },
  batchNumber: {
    type: String,
    trim: true,
    index: true
  },
  batchRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    index: true
  },
  nominees: [NomineeSchema],
  activityLog: [ActivityLogSchema],
  notes: [NoteSchema],
  quotationSentDate: Date,
  agreementSentDate: Date,
  agreementSignedDate: Date,
  isActive: {
    type: Boolean,
    default: true
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

EnquirySchema.index({ enquiryId: 1 }, { unique: true });
EnquirySchema.index({ client: 1, status: 1 });
EnquirySchema.index({ course: 1, status: 1 });
EnquirySchema.index({ startDate: 1, status: 1 });
EnquirySchema.index({ batchNumber: 1 });
EnquirySchema.index({ status: 1, date: -1 });
EnquirySchema.index({ client: 1, course: 1, startDate: 1 });

EnquirySchema.virtual('pending').get(function() {
  return this.requested - this.nominated;
});

EnquirySchema.methods.addActivity = function(action, details, userId, userName) {
  this.activityLog.push({
    action,
    details,
    userId,
    userName,
    timestamp: new Date()
  });
  return this.save();
};

EnquirySchema.methods.addNote = function(content, userId, userName) {
  this.notes.push({
    content,
    userId,
    userName,
    timestamp: new Date()
  });
  return this.save();
};

EnquirySchema.methods.updateStatus = function(newStatus, userId, userName, details = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  const logDetails = details || `Status changed from ${oldStatus} to ${newStatus}`;
  this.addActivity('Status Change', logDetails, userId, userName);
  return this.save();
};

module.exports = mongoose.model('Enquiry', EnquirySchema);
