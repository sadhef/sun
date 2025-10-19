const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getWeeklySchedule,
  getMonthlySchedule
} = require('../controllers/scheduleController');

router.get('/', protect, getAllSchedules);
router.get('/weekly', protect, getWeeklySchedule);
router.get('/monthly', protect, getMonthlySchedule);
router.get('/:id', protect, getScheduleById);
router.post('/', protect, authorize('Admin', 'Training Coordinator'), createSchedule);
router.put('/:id', protect, authorize('Admin', 'Training Coordinator'), updateSchedule);
router.delete('/:id', protect, authorize('Admin', 'Training Coordinator'), deleteSchedule);

module.exports = router;
