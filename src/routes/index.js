import { Router } from 'express';
import authRouter from './auth.route';
import lessonRouter from './lessons.route';
import paymentRoute from './payment.route';
import pastQuestionsRouter from './pastQuestions.route';
import userRouter from './users.route';
import coursesRouter from './courses.route';
import mainSubjectsRouter from './mainSubjects.route';
import termRouter from './terms.route';
import courseCategoryRouter from './courseCategories.route';
import countsRouter from './counts.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/past-questions', pastQuestionsRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/main-subjects', mainSubjectsRouter);
router.use('/term', termRouter);
router.use('/course_categories', courseCategoryRouter);
router.use('/lesson', lessonRouter);
router.use('/counts', countsRouter);
router.use('/payments', paymentRoute);

export default router;
