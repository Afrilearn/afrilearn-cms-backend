import { Router } from 'express';
import authRouter from './auth.route';
import lessonRoute from './lesson.route';
import paymentRoute from './payment.route';
import adminRoute from './admin.route';

const router = Router();

router.use('/auth', authRouter);

router.use('/lesson', lessonRoute);

router.use('/plan', paymentRoute);

router.use('/admin', adminRoute);

export default router;
