const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

router.get('/', protect, getAllRooms);
router.get('/:id', protect, getRoomById);
router.post('/', protect, authorize('Admin', 'Training Coordinator'), createRoom);
router.put('/:id', protect, authorize('Admin', 'Training Coordinator'), updateRoom);
router.delete('/:id', protect, authorize('Admin'), deleteRoom);

module.exports = router;
