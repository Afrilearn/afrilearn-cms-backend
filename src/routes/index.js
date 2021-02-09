import { Router } from 'express';
import authRouter from './auth.route';
import pqCategoryRouter from './pastquestion_category.route';

const router = Router();

router.use('/auth', authRouter);
router.use('', pqCategoryRouter);

export default router;
