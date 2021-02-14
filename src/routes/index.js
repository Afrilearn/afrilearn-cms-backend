import { Router } from 'express';
import authRouter from './auth.route';
import lessonRouter from './lessons.route';
import pqCategoryRouter from './pastQuestionCategory.route';
import userRouter from './users.route';
import coursesRouter from './courses.route';
import mainSubjectsRouter from './mainSubjects.route';
import termRouter from './terms.route';
import courseCategoryRouter from './courseCategories.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/pqcategory', pqCategoryRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/majorsubject', mainSubjectsRouter);
router.use('/term', termRouter);
router.use('/course_categories', courseCategoryRouter);
router.use('/lesson', lessonRouter);

export default router;
