import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getFinalExamQuestions, getAdminCourses, getCourseStudents } from '../controllers/course.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, admin, createCourse);

router.get('/admin', protect, admin, getAdminCourses);

router.get('/:id/exam', getFinalExamQuestions);
router.get('/:id/students', protect, admin, getCourseStudents);

router.route('/:id')
  .get(getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

export default router;
