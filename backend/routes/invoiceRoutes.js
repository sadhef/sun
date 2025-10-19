const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markAsPaid
} = require('../controllers/invoiceController');

router.get('/', protect, getAllInvoices);
router.get('/:id', protect, getInvoiceById);
router.post('/', protect, authorize('Admin', 'Accountant'), createInvoice);
router.put('/:id', protect, authorize('Admin', 'Accountant'), updateInvoice);
router.delete('/:id', protect, authorize('Admin'), deleteInvoice);
router.put('/:id/paid', protect, authorize('Admin', 'Accountant'), markAsPaid);

module.exports = router;
