const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllLeaves,
  createLeave,
  approveLeave,
  rejectLeave
} = require('../controllers/leaveController');

router.get('/', protect, getAllLeaves);
router.post('/', protect, createLeave);
router.put('/:id/approve', protect, authorize('Admin', 'Training Coordinator'), approveLeave);
router.put('/:id/reject', protect, authorize('Admin', 'Training Coordinator'), rejectLeave);

module.exports = router;
