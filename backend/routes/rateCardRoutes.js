const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllRateCards,
  getClientRateCard,
  createRateCard,
  updateRateCard
} = require('../controllers/rateCardController');

router.get('/', protect, getAllRateCards);
router.get('/client/:clientId', protect, getClientRateCard);
router.post('/', protect, authorize('Admin', 'Accountant'), createRateCard);
router.put('/:id', protect, authorize('Admin', 'Accountant'), updateRateCard);

module.exports = router;
