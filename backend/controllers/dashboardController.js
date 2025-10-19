const Enquiry = require('../models/Enquiry');
const Schedule = require('../models/Schedule');
const Invoice = require('../models/Invoice');
const Leave = require('../models/Leave');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const openEnquiries = await Enquiry.countDocuments({
      status: { $in: ['Draft', 'Quotation Sent', 'Agreement Pending', 'Agreement Sent'] },
      isActive: true
    });

    const pendingNominations = await Enquiry.countDocuments({
      status: { $in: ['Pending Nomination', 'Nominated'] },
      isActive: true
    });

    const upcomingClasses = await Schedule.countDocuments({
      date: { $gte: today, $lte: sevenDaysLater },
      status: 'Scheduled'
    });

    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });

    const pendingInvoices = await Invoice.find({ status: { $in: ['Draft', 'Sent'] } });
    const pendingInvoicesCount = pendingInvoices.length;
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    const paidInvoices = await Invoice.find({ status: 'Paid' });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    res.json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTodaySchedule = async (req, res) => {
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

    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentEnquiries = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const enquiries = await Enquiry.find({ isActive: true })
      .sort({ date: -1 })
      .limit(limit)
      .select('enquiryId client course status date');

    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
