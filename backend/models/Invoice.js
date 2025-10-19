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
