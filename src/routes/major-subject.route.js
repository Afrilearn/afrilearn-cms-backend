import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import MajorSubjectController from '../controllers/major-subjects.controller';
import MajorSubjectMiddleware from '../middlewares/major-subject.middleware';
import AddMajorSubjectValidator from '../validations/add-major-subject.validator';

const router = Router();

router.post(
  '/majorsubject',
  AuthMiddleware.verifyUserToken,
  AuthMiddleware.verifyManager,
  AddMajorSubjectValidator.validateData(),
  AddMajorSubjectValidator.myValidationResult,
  MajorSubjectMiddleware.CheckSubjectExists,
  MajorSubjectController.addMajorSubject,
);

router.put(
  '/majorsubject/:id',
  AuthMiddleware.verifyUserToken,
  AuthMiddleware.verifyManager,
  MajorSubjectController.updateMajorSubject,
);

router.delete(
  '/majorsubject/:id',
  AuthMiddleware.verifyUserToken,
  AuthMiddleware.verifyManager,
  MajorSubjectController.deleteMajorSubject,
);

export default router;
