import { Router } from 'express';
import authRouter from './auth.route';
import lessonRoute from './lesson.route';
import paymentRoute from './payment.route';
import adminRoute from './admin.route';
import userRouter from './users.route';
import coursesRouter from './courses.route';
import mainSubjectsRouter from './mainSubjects.route';
import courseCategoryRouter from './courseCategories.route';


const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/subjects', mainSubjectsRouter);
router.use('/course_categories', courseCategoryRouter);

router.use('/lesson', lessonRoute);

router.use('/plan', paymentRoute);

router.use('/admin', adminRoute);

export default router;
