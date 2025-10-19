const Trainer = require('../models/Trainer');
const Schedule = require('../models/Schedule');
const Leave = require('../models/Leave');

exports.getAllTrainers = async (req, res) => {
  try {
    const { status, specialization, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (specialization) query.specializations = specialization;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const trainers = await Trainer.find(query).sort({ name: 1 });
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Trainer with this email or Civil ID already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrainerAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    const schedules = await Schedule.find({
      trainer: req.params.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: { $in: ['Scheduled', 'In Progress'] }
    });

    const leaves = await Leave.find({
      trainer: req.params.id,
      status: 'Approved',
      $or: [{ startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }]
    });

    res.json({ success: true, data: { trainer: { id: trainer._id, name: trainer.name, availability: trainer.availability }, schedules, leaves } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
