const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Enquiry = require('../models/Enquiry');
const Schedule = require('../models/Schedule');
const Invoice = require('../models/Invoice');
const Certificate = require('../models/Certificate');

router.get('/enquiries', protect, async (req, res) => {
  try {
    const { startDate, endDate, status, client } = req.query;
    let query = { isActive: true };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) query.status = status;
    if (client) query.client = { $regex: client, $options: 'i' };

    const enquiries = await Enquiry.find(query)
      .populate('clientRef', 'name')
      .sort({ date: -1 });

    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/schedules', protect, async (req, res) => {
  try {
    const { startDate, endDate, trainer, room, status } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (trainer) query.trainer = trainer;
    if (room) query.room = room;
    if (status) query.status = status;

    const schedules = await Schedule.find(query)
      .populate('enquiry', 'client course')
      .populate('trainer', 'name')
      .populate('room', 'name')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/revenue', protect, authorize('Admin', 'Accountant'), async (req, res) => {
  try {
    const { startDate, endDate, client } = req.query;
    let query = { status: 'Paid' };

    if (startDate && endDate) {
      query.paidDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (client) query.client = { $regex: client, $options: 'i' };

    const invoices = await Invoice.find(query)
      .populate('clientRef', 'name')
      .sort({ paidDate: -1 });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTax = invoices.reduce((sum, inv) => sum + inv.tax.amount, 0);

    res.json({
      success: true,
      count: invoices.length,
      totalRevenue,
      totalTax,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/certificates', protect, async (req, res) => {
  try {
    const { startDate, endDate, status, course } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.issueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) query.status = status;
    if (course) query.course = { $regex: course, $options: 'i' };

    const certificates = await Certificate.find(query)
      .populate('student', 'name civilId')
      .populate('trainer', 'name')
      .sort({ issueDate: -1 });

    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
