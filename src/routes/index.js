import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './users.route';
import coursesRouter from './courses.route';
import mainSubjectsRouter from './major-subject.route';
import termRouter from './terms.route';
import courseCategoryRouter from './courseCategories.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/majorsubject', mainSubjectsRouter);
router.use('/term', termRouter);
router.use('/course_categories', courseCategoryRouter);

export default router;
