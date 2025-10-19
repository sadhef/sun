const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  verifyCertificate
} = require('../controllers/certificateController');

router.get('/', protect, getAllCertificates);
router.get('/:id', protect, getCertificateById);
router.post('/', protect, authorize('Admin', 'Training Coordinator'), createCertificate);
router.get('/verify/:code', verifyCertificate);

module.exports = router;
