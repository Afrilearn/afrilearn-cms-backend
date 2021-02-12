import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import LessonController from "../controllers/lessons.controller";
import LessonValidator from "../validations/lessons.validator";
import ParamsValidator from "../validations/params.validator";

const router = Router();

router.get(
  "/",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  LessonController.fetchAllLessons
);

router.put(
  "/:id",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  LessonValidator.validateLessonEditData(),
  LessonValidator.lessonEditValidationResult,
  LessonController.updateLesson
);

router.delete(
  "/:id",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  LessonController.deleteLesson
);

router.put(
  "/video",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  LessonController.addVideo
);

router.get(
  "/quiz",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  LessonController.viewQuiz
);

router.post(
  "/quiz",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  LessonValidator.validateQuiz(),
  LessonValidator.quizValidationResult,
  LessonController.createQuiz
);

router.put(
  "/quiz/:quizId",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  ParamsValidator.validateMongooseId('quizId'),
  LessonValidator.validateQuizUpdate(),
  LessonValidator.quizUpdateValidationResult,
  LessonController.modifyQuiz
);

router.delete(
  "/quiz/:quizId",
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess("602209ab2792e63fc841de3c"),
  ParamsValidator.validateMongooseId('quizId'),
  ParamsValidator.mongooseIdValidationResult,
  LessonController.removeQuiz
);

export default router;
