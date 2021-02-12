import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import MajorSubjectController from '../controllers/mainSubjects.controller';
import MajorSubjectMiddleware from '../middlewares/majorSubject.middleware';
import AddMajorSubjectValidator from '../validations/majorSubject.validator';

const router = Router();

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  MajorSubjectController.fetchAllSubjects,
);

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  AddMajorSubjectValidator.validateData(),
  AddMajorSubjectValidator.myValidationResult,
  MajorSubjectMiddleware.CheckSubjectExists,
  MajorSubjectController.addMajorSubject,
);

router.put(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  MajorSubjectController.updateMajorSubject,
);

router.delete(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  MajorSubjectController.deleteMajorSubject,
);

export default router;
