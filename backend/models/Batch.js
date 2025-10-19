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
  contactNumber: {
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
  }
}, { _id: false });

const ClientGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Company', 'Individual'],
    default: 'Company'
  },
  students: [NomineeSchema]
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

const BatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  courseName: {
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
  date: {
    type: Date,
    index: true
  },
  session: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Full Day'],
    default: 'Morning'
  },
  startTime: String,
  endTime: String,
  classCapacity: {
    type: Number,
    required: true,
    min: 1,
    default: 15
  },
  nominated: {
    type: Number,
    default: 0,
    min: 0
  },
  pending: {
    type: Number,
    min: 0
  },
  nominees: [ClientGroupSchema],
  trainer: {
    type: String,
    trim: true
  },
  trainerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  room: {
    type: String,
    trim: true
  },
  roomRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  enquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry'
  }],
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Draft',
    index: true
  },
  activityLog: [ActivityLogSchema],
  notes: [NoteSchema],
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

BatchSchema.index({ batchId: 1 }, { unique: true });
BatchSchema.index({ courseName: 1, date: 1 });
BatchSchema.index({ courseName: 1, pending: 1 });
BatchSchema.index({ date: 1, status: 1 });
BatchSchema.index({ status: 1 });

BatchSchema.virtual('totalStudents').get(function() {
  return this.nominees.reduce((sum, group) => sum + group.students.length, 0);
});

BatchSchema.pre('save', function(next) {
  this.nominated = this.nominees.reduce((sum, group) => sum + group.students.length, 0);
  this.pending = Math.max(0, this.classCapacity - this.nominated);
  next();
});

BatchSchema.statics.findAvailableBatches = function(courseName) {
  return this.find({
    courseName,
    pending: { $gt: 0 },
    status: { $in: ['Draft', 'Confirmed'] }
  }).sort({ date: 1 });
};

module.exports = mongoose.model('Batch', BatchSchema);
