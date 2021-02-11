import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import SubjectsController from '../controllers/subjects.controller';

const router = Router();

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  SubjectsController.fetchAllSubjects,
);

export default router;
