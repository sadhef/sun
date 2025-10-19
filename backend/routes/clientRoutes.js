const express = require('express');
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllClients)
  .post(authorize('Admin', 'Training Coordinator'), createClient);

router.route('/:id')
  .get(getClientById)
  .put(authorize('Admin', 'Training Coordinator'), updateClient)
  .delete(authorize('Admin'), deleteClient);

module.exports = router;
