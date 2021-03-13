import { Router } from 'express';
import authRouter from './auth.route';
import lessonRouter from './lessons.route';
import paymentRoute from './payment.route';
import pqCategoryRouter from './pastQuestionCategory.route';
import userRouter from './users.route';
import coursesRouter from './courses.route';
import mainSubjectsRouter from './mainSubjects.route';
import termRouter from './terms.route';
import courseCategoryRouter from './courseCategories.route';
import countsRouter from './counts.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/pqcategory', pqCategoryRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/main_subjects', mainSubjectsRouter);
router.use('/terms', termRouter);
router.use('/course_categories', courseCategoryRouter);
router.use('/lessons', lessonRouter);
router.use('/counts', countsRouter);
router.use('/payments', paymentRoute);

export default router;
