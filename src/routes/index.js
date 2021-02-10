import { Router } from 'express';
import authRouter from './auth.route';
import majorSubjectRouter from './major-subject.route';

const router = Router();

router.use('/auth', authRouter);
router.use('', majorSubjectRouter);

export default router;
