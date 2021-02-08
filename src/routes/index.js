import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './users.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
