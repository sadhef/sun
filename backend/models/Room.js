const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    unique: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: [true, 'Room code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1
  },
  location: {
    building: String,
    floor: String,
    wing: String
  },
  facilities: [{
    type: String,
    enum: ['Projector', 'Whiteboard', 'AC', 'Audio System', 'Computer', 'WiFi', 'Camera']
  }],
  status: {
    type: String,
    enum: ['Available', 'Maintenance', 'Unavailable'],
    default: 'Available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

RoomSchema.index({ name: 1, status: 1 });
RoomSchema.index({ isActive: 1 });

module.exports = mongoose.model('Room', RoomSchema);
