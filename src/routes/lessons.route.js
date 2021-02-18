import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import LessonController from '../controllers/lessons.controller';
import LessonValidator from '../validations/lessons.validator';
import ParamsValidator from '../validations/params.validator';
import multer from 'multer';

const router = Router();

const upload = multer({ dest: 'temp/' });

router.post(
  '/', 
  upload.array("videoUrls"),
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
  upload.array("videoUrls"),
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
  upload.array("images"),
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonValidator.validateQuiz(),
  LessonValidator.quizValidationResult,
  LessonController.createQuiz,
);

router.put(
  '/:lessonId/quiz',
  upload.array("images"),
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  LessonValidator.validateQuizUpdate(),
  LessonValidator.quizUpdateValidationResult,
  LessonController.modifyQuiz,
);

router.delete(
  '/quiz/:questionId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  ParamsValidator.validateMongooseId('questionId'),
  ParamsValidator.mongooseIdValidationResult,
  LessonController.removeQuiz,
);

export default router;
