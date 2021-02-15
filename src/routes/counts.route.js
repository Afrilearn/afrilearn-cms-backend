import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import CountsController from '../controllers/counts.controller';

const router = Router();

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  CountsController.fetchAllCounts,
);

export default router;
