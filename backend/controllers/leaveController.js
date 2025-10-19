const Leave = require('../models/Leave');
const Counter = require('../models/Counter');

const generateLeaveId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'leave' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );
  return `LV-${String(counter.value).padStart(5, '0')}`;
};

exports.getAllLeaves = async (req, res) => {
  try {
    const { status, trainer } = req.query;
    let query = {};

    if (status) query.status = status;
    if (trainer) query.trainer = trainer;

    const leaves = await Leave.find(query)
      .populate('trainer', 'name email')
      .sort({ startDate: -1 });

    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLeave = async (req, res) => {
  try {
    const leaveId = await generateLeaveId();
    req.body.leaveId = leaveId;
    req.body.createdBy = req.user._id;

    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved', approvedBy: req.user._id, approvedDate: new Date() },
      { new: true }
    );
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { reason } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', approvedBy: req.user._id, rejectionReason: reason, approvedDate: new Date() },
      { new: true }
    );
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
