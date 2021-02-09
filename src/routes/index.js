import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './users.route';
import coursesRouter from './courses.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);

export default router;
