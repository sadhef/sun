const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { isActive: true };

    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const rooms = await Room.find(query).sort({ name: 1 });
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Room with this name or code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
