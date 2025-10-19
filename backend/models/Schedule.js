const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  scheduleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  enquiry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry',
    required: true,
    index: true
  },
  enquiryId: {
    type: String,
    required: true,
    index: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    index: true
  },
  batchNumber: {
    type: String,
    index: true
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
  client: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    index: true
  },
  trainerName: {
    type: String,
    trim: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    index: true
  },
  roomName: {
    type: String,
    trim: true
  },
  session: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Full Day'],
    default: 'Morning'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled',
    index: true
  },
  notes: {
    type: String,
    trim: true
  },
  isInternal: {
    type: Boolean,
    default: false
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

ScheduleSchema.index({ date: 1, room: 1, startTime: 1 });
ScheduleSchema.index({ date: 1, trainer: 1, startTime: 1 });
ScheduleSchema.index({ enquiry: 1 });
ScheduleSchema.index({ status: 1, date: 1 });

// Check for room conflicts
ScheduleSchema.methods.checkRoomConflict = async function() {
  const Schedule = this.constructor;
  const conflicts = await Schedule.find({
    _id: { $ne: this._id },
    room: this.room,
    date: this.date,
    status: { $in: ['Scheduled', 'In Progress'] },
    $or: [
      { startTime: { $lt: this.endTime, $gte: this.startTime } },
      { endTime: { $gt: this.startTime, $lte: this.endTime } },
      { startTime: { $lte: this.startTime }, endTime: { $gte: this.endTime } }
    ]
  });
  return conflicts.length > 0;
};

// Check for trainer conflicts
ScheduleSchema.methods.checkTrainerConflict = async function() {
  const Schedule = this.constructor;
  const conflicts = await Schedule.find({
    _id: { $ne: this._id },
    trainer: this.trainer,
    date: this.date,
    status: { $in: ['Scheduled', 'In Progress'] },
    $or: [
      { startTime: { $lt: this.endTime, $gte: this.startTime } },
      { endTime: { $gt: this.startTime, $lte: this.endTime } },
      { startTime: { $lte: this.startTime }, endTime: { $gte: this.endTime } }
    ]
  });
  return conflicts.length > 0;
};

module.exports = mongoose.model('Schedule', ScheduleSchema);
