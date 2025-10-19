const express = require('express');
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  updateEnquiryStatus,
  addNoteToEnquiry,
  deleteEnquiry,
  getEnquiryStats
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllEnquiries)
  .post(authorize('Admin', 'Training Coordinator'), createEnquiry);

router.get('/stats', getEnquiryStats);

router.route('/:id')
  .get(getEnquiryById)
  .put(authorize('Admin', 'Training Coordinator'), updateEnquiry)
  .delete(authorize('Admin'), deleteEnquiry);

router.put('/:id/status', authorize('Admin', 'Training Coordinator'), updateEnquiryStatus);
router.post('/:id/notes', addNoteToEnquiry);

module.exports = router;
