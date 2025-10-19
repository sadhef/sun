const express = require('express');
const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  addNomineesToBatch,
  getAvailableBatches,
  deleteBatch
} = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllBatches)
  .post(authorize('Admin', 'Training Coordinator'), createBatch);

router.get('/available', getAvailableBatches);

router.route('/:id')
  .get(getBatchById)
  .put(authorize('Admin', 'Training Coordinator'), updateBatch)
  .delete(authorize('Admin'), deleteBatch);

router.post('/:id/nominees', authorize('Admin', 'Training Coordinator'), addNomineesToBatch);

module.exports = router;
