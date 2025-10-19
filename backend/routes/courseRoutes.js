const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllCourses)
  .post(authorize('Admin'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(authorize('Admin'), updateCourse)
  .delete(authorize('Admin'), deleteCourse);

module.exports = router;
