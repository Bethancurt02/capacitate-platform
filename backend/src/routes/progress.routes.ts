import express from 'express';
import { getProgress, markLessonCompleted, passFinalExam, getAllProgress, passLessonQuiz, resetProgress } from '../controllers/progress.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, getAllProgress);

router.route('/:courseId')
  .get(protect, getProgress)
  .delete(protect, resetProgress);

router.route('/:courseId/lesson/:lessonId')
  .post(protect, markLessonCompleted);

router.route('/:courseId/lesson/:lessonId/quiz')
  .post(protect, passLessonQuiz);

router.route('/:courseId/exam')
  .post(protect, passFinalExam);

export default router;
