import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import LessonController from '../controllers/lessons.controller';
import LessonValidator from '../validations/lessons.validator';

const router = Router();

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonController.fetchAllLessons,
);

router.put(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonValidator.validateLessonEditData(),
  LessonValidator.lessonEditValidationResult,
  LessonController.updateLesson,
);

router.delete(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonController.deleteLesson,
);

export default router;
