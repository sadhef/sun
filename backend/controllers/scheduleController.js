const Schedule = require('../models/Schedule');
const Counter = require('../models/Counter');

const generateScheduleId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'schedule' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );
  return `SCH-${String(counter.value).padStart(5, '0')}`;
};

exports.getAllSchedules = async (req, res) => {
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
      .populate('enquiry', 'client')
      .populate('room', 'name')
      .populate('trainer', 'name')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWeeklySchedule = async (req, res) => {
  try {
    const { week } = req.query;
    const [year, weekNum] = week.split('-W');
    const startDate = new Date(year, 0, 1 + (weekNum - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const schedules = await Schedule.find({
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['Scheduled', 'In Progress'] }
    })
      .populate('room', 'name')
      .populate('trainer', 'name')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMonthlySchedule = async (req, res) => {
  try {
    const { month } = req.query;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const schedules = await Schedule.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .populate('room', 'name')
      .populate('trainer', 'name')
      .sort({ date: 1 });

    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const scheduleId = await generateScheduleId();
    req.body.scheduleId = scheduleId;
    req.body.createdBy = req.user._id;

    const schedule = new Schedule(req.body);

    const roomConflict = await schedule.checkRoomConflict();
    if (roomConflict) {
      return res.status(400).json({ success: false, message: 'Room is already booked at this time' });
    }

    const trainerConflict = await schedule.checkTrainerConflict();
    if (trainerConflict) {
      return res.status(400).json({ success: false, message: 'Trainer is already scheduled at this time' });
    }

    await schedule.save();
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
