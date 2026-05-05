import express from 'express';
import { getLessonsByCourse, createLesson, getQuestionsByLesson, createQuestion } from '../controllers/lesson.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/course/:courseId')
  .get(getLessonsByCourse);

router.route('/')
  .post(protect, admin, createLesson);

router.route('/:lessonId/questions')
  .get(getQuestionsByLesson)
  .post(protect, admin, createQuestion);

export default router;
