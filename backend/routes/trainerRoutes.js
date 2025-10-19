const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerAvailability
} = require('../controllers/trainerController');

router.get('/', protect, getAllTrainers);
router.get('/:id', protect, getTrainerById);
router.post('/', protect, authorize('Admin', 'Training Coordinator'), createTrainer);
router.put('/:id', protect, authorize('Admin', 'Training Coordinator'), updateTrainer);
router.delete('/:id', protect, authorize('Admin'), deleteTrainer);
router.get('/:id/availability', protect, getTrainerAvailability);

module.exports = router;
