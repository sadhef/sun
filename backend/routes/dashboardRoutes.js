const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  getTodaySchedule,
  getRecentEnquiries
} = require('../controllers/dashboardController');

router.get('/stats', protect, getDashboardStats);
router.get('/today-schedule', protect, getTodaySchedule);
router.get('/recent-enquiries', protect, getRecentEnquiries);

module.exports = router;
