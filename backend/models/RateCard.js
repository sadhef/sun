const mongoose = require('mongoose');

const CourseRateSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    trim: true
  },
  courseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  notes: String
}, { _id: false });

const RateCardSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  clientRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  courses: [CourseRateSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date
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

RateCardSchema.index({ client: 1, isActive: 1 });
RateCardSchema.index({ clientRef: 1 });

// Auto-calculate final price
RateCardSchema.pre('save', function(next) {
  this.courses.forEach(course => {
    const discountAmount = (course.basePrice * course.discount) / 100;
    course.finalPrice = course.basePrice - discountAmount;
  });
  next();
});

module.exports = mongoose.model('RateCard', RateCardSchema);
