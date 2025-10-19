const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByCivilId,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllStudents)
  .post(authorize('Admin', 'Training Coordinator'), createStudent);

router.get('/civil/:civilId', getStudentByCivilId);

router.route('/:id')
  .get(getStudentById)
  .put(authorize('Admin', 'Training Coordinator'), updateStudent)
  .delete(authorize('Admin'), deleteStudent);

module.exports = router;
