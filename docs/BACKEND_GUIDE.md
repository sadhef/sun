# Backend Implementation Guide

## 📚 Table of Contents
1. [Missing Database Models](#missing-database-models)
2. [API Routes Structure](#api-routes-structure)
3. [Controllers Implementation](#controllers-implementation)
4. [Middleware & Utilities](#middleware--utilities)
5. [Business Logic Patterns](#business-logic-patterns)

---

## 🗄️ Missing Database Models

### 1. Trainer Model

**File:** `backend/models/Trainer.js`

```javascript
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
```

### 2. Room Model

**File:** `backend/models/Room.js`

```javascript
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
```

### 3. Schedule Model

**File:** `backend/models/Schedule.js`

```javascript
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
```

### 4. Leave Model

**File:** `backend/models/Leave.js`

```javascript
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
```

### 5. Invoice Model

**File:** `backend/models/Invoice.js`

```javascript
const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  enquiry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry'
  },
  enquiryId: String,
  course: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
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
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
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
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  items: [InvoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    rate: {
      type: Number,
      default: 0,
      min: 0
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'KWD',
    enum: ['KWD', 'USD', 'EUR', 'GBP']
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft',
    index: true
  },
  paidDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Cheque', 'Card', 'Other']
  },
  notes: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String
  },
  sentDate: {
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

InvoiceSchema.index({ client: 1, status: 1 });
InvoiceSchema.index({ issueDate: 1 });
InvoiceSchema.index({ status: 1, dueDate: 1 });

// Auto-calculate totals
InvoiceSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    const discountAmount = (itemTotal * item.discount) / 100;
    item.totalPrice = itemTotal - discountAmount;
    return sum + item.totalPrice;
  }, 0);

  this.tax.amount = (this.subtotal * this.tax.rate) / 100;
  this.totalAmount = this.subtotal + this.tax.amount;

  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
```

### 6. Certificate Model

**File:** `backend/models/Certificate.js`

```javascript
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
```

### 7. RateCard Model

**File:** `backend/models/RateCard.js`

```javascript
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
```

---

## 🔌 API Routes Structure

### Complete Routes List

**File:** `backend/server.js` (add these routes)

```javascript
// Import all routes
const trainerRoutes = require('./routes/trainerRoutes');
const roomRoutes = require('./routes/roomRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const rateCardRoutes = require('./routes/rateCardRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Register routes
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/rate-cards', rateCardRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reports', reportRoutes);
```

---

## 📝 Controllers Implementation

### Dashboard Controller

**File:** `backend/controllers/dashboardController.js`

```javascript
const Enquiry = require('../models/Enquiry');
const Schedule = require('../models/Schedule');
const Invoice = require('../models/Invoice');
const Leave = require('../models/Leave');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    // Open Enquiries
    const openEnquiries = await Enquiry.countDocuments({
      status: { $in: ['Draft', 'Quotation Sent', 'Agreement Pending', 'Agreement Sent'] },
      isActive: true
    });

    // Pending Nominations
    const pendingNominations = await Enquiry.countDocuments({
      status: { $in: ['Pending Nomination', 'Nominated'] },
      isActive: true
    });

    // Upcoming Classes (7 days)
    const upcomingClasses = await Schedule.countDocuments({
      date: { $gte: today, $lte: sevenDaysLater },
      status: 'Scheduled'
    });

    // Pending Leaves
    const pendingLeaves = await Leave.countDocuments({
      status: 'Pending'
    });

    // Pending Invoices
    const pendingInvoices = await Invoice.find({
      status: { $in: ['Draft', 'Sent'] }
    });

    const pendingInvoicesCount = pendingInvoices.length;
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Total Revenue
    const paidInvoices = await Invoice.find({ status: 'Paid' });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        openEnquiries,
        pendingNominations,
        upcomingClasses,
        pendingLeaves,
        pendingInvoicesCount,
        pendingInvoicesAmount,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's schedule
// @route   GET /api/v1/dashboard/today-schedule
// @access  Private
exports.getTodaySchedule = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await Schedule.find({
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['Scheduled', 'In Progress'] }
    })
    .populate('enquiry', 'client')
    .populate('room', 'name')
    .populate('trainer', 'name')
    .sort('startTime');

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent enquiries
// @route   GET /api/v1/dashboard/recent-enquiries
// @access  Private
exports.getRecentEnquiries = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const enquiries = await Enquiry.find({ isActive: true })
      .sort({ date: -1 })
      .limit(limit)
      .select('enquiryId client course status date');

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};
```

### Trainer Controller

**File:** `backend/controllers/trainerController.js`

```javascript
const Trainer = require('../models/Trainer');

// @desc    Get all trainers
// @route   GET /api/v1/trainers
// @access  Private
exports.getAllTrainers = async (req, res, next) => {
  try {
    const { status, specialization, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (specialization) {
      query.specializations = specialization;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const trainers = await Trainer.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trainer by ID
// @route   GET /api/v1/trainers/:id
// @access  Private
exports.getTrainerById = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new trainer
// @route   POST /api/v1/trainers
// @access  Private/Admin
exports.createTrainer = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    const trainer = await Trainer.create(req.body);

    res.status(201).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Trainer with this email or Civil ID already exists'
      });
    }
    next(error);
  }
};

// @desc    Update trainer
// @route   PUT /api/v1/trainers/:id
// @access  Private/Admin
exports.updateTrainer = async (req, res, next) => {
  try {
    req.body.updatedBy = req.user._id;

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trainer
// @route   DELETE /api/v1/trainers/:id
// @access  Private/Admin
exports.deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trainer availability
// @route   GET /api/v1/trainers/:id/availability
// @access  Private
exports.getTrainerAvailability = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const Schedule = require('../models/Schedule');
    const Leave = require('../models/Leave');

    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    // Get scheduled classes
    const schedules = await Schedule.find({
      trainer: req.params.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: { $in: ['Scheduled', 'In Progress'] }
    });

    // Get approved leaves
    const leaves = await Leave.find({
      trainer: req.params.id,
      status: 'Approved',
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        trainer: {
          id: trainer._id,
          name: trainer.name,
          availability: trainer.availability
        },
        schedules,
        leaves
      }
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Continue in next sections...

Due to length, the remaining controllers (Room, Schedule, Leave, Invoice, Certificate, RateCard, Report) will follow the same pattern. Reference the patterns above to create:

1. CRUD operations (getAll, getById, create, update, delete)
2. Custom methods for business logic
3. Proper error handling
4. Validation
5. Authorization checks

See [API_REFERENCE.md](./API_REFERENCE.md) for complete endpoint documentation.

---

## 🔐 Middleware & Utilities

### Role-Based Authorization

**File:** `backend/middleware/roleAuth.js`

```javascript
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};
```

### File Upload

**File:** `backend/middleware/upload.js`

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;
```

### PDF Generator

**File:** `backend/utils/pdfGenerator.js`

```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateInvoicePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
      const filePath = path.join(__dirname, '..', 'uploads', 'invoices', fileName);

      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();

      // Company info
      doc.fontSize(12).text('Sun Training Institute', 50, 100);
      doc.fontSize(10).text('Address Line 1', 50, 115);
      doc.text('Address Line 2', 50, 130);
      doc.text('Phone: +965 XXXX XXXX', 50, 145);
      doc.text('Email: info@suntraining.com', 50, 160);

      // Invoice details
      doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`, 350, 100);
      doc.fontSize(10).text(`Date: ${invoice.issueDate.toLocaleDateString()}`, 350, 115);
      doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, 350, 130);

      doc.moveDown(2);

      // Client info
      doc.fontSize(12).text('Bill To:', 50, 200);
      doc.fontSize(10).text(invoice.client, 50, 215);
      doc.text(invoice.contactName || '', 50, 230);
      doc.text(invoice.contactEmail || '', 50, 245);
      doc.text(invoice.contactPhone || '', 50, 260);

      doc.moveDown(3);

      // Table header
      const tableTop = 300;
      doc.fontSize(10);
      doc.text('Description', 50, tableTop, { width: 200 });
      doc.text('Qty', 260, tableTop, { width: 50, align: 'right' });
      doc.text('Unit Price', 320, tableTop, { width: 80, align: 'right' });
      doc.text('Discount', 410, tableTop, { width: 60, align: 'right' });
      doc.text('Total', 480, tableTop, { width: 80, align: 'right' });

      // Line
      doc.moveTo(50, tableTop + 15).lineTo(560, tableTop + 15).stroke();

      // Table rows
      let y = tableTop + 25;
      invoice.items.forEach((item, i) => {
        doc.text(item.course, 50, y, { width: 200 });
        doc.text(item.quantity.toString(), 260, y, { width: 50, align: 'right' });
        doc.text(item.unitPrice.toFixed(2), 320, y, { width: 80, align: 'right' });
        doc.text(`${item.discount}%`, 410, y, { width: 60, align: 'right' });
        doc.text(item.totalPrice.toFixed(2), 480, y, { width: 80, align: 'right' });
        y += 20;
      });

      // Line
      doc.moveTo(50, y).lineTo(560, y).stroke();
      y += 15;

      // Totals
      doc.text('Subtotal:', 400, y);
      doc.text(invoice.subtotal.toFixed(2), 480, y, { width: 80, align: 'right' });
      y += 20;

      if (invoice.tax.rate > 0) {
        doc.text(`Tax (${invoice.tax.rate}%):`, 400, y);
        doc.text(invoice.tax.amount.toFixed(2), 480, y, { width: 80, align: 'right' });
        y += 20;
      }

      doc.fontSize(12).text('Total:', 400, y);
      doc.text(`${invoice.currency} ${invoice.totalAmount.toFixed(2)}`, 480, y, { width: 80, align: 'right' });

      // Footer
      if (invoice.notes) {
        doc.fontSize(10).text(`Notes: ${invoice.notes}`, 50, y + 50, { width: 500 });
      }

      doc.end();

      writeStream.on('finish', () => {
        resolve(filePath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.generateCertificatePDF = async (certificate) => {
  // Similar implementation for certificates
  // Can be customized with logos, signatures, etc.
};
```

---

## ✅ Next Steps

1. Create all route files following the pattern in existing routes
2. Implement remaining controllers (Schedule, Leave, Invoice, Certificate, RateCard, Report)
3. Test all endpoints with Postman/Thunder Client
4. Create seed data for testing
5. Move to [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) for React implementation

