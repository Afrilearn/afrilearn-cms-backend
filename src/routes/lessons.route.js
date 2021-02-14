import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import LessonMiddleware from '../middlewares/lesson.middleware';
import LessonController from '../controllers/lessons.controller';
import LessonValidator from '../validations/lessons.validator';
import ParamsValidator from '../validations/params.validator';

const router = Router();

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonValidator.validateLessonCreationData(),
  LessonValidator.lessonCreationValidationResult,
  LessonController.createLesson,
);

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

router.get(
  '/:lessonId/quiz',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonController.viewLessonQuiz,
);

router.post(
  '/quiz',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonValidator.validateQuiz(),
  LessonValidator.quizValidationResult,
  LessonMiddleware.checkQuestionExists,
  LessonController.createQuiz,
);

router.put(
  '/quiz/:quizId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  ParamsValidator.validateMongooseId('quizId'),
  ParamsValidator.mongooseIdValidationResult,
  LessonValidator.validateQuizUpdate(),
  LessonValidator.quizUpdateValidationResult,
  LessonController.modifyQuiz,
);

router.delete(
  '/quiz/:quizId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  ParamsValidator.validateMongooseId('quizId'),
  ParamsValidator.mongooseIdValidationResult,
  LessonController.removeQuiz,
);

export default router;
