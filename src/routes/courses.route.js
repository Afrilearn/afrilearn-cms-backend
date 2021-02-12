import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import CourseValidator from '../validations/courses.validator';
import CoursesMiddleware from '../middlewares/courses.middleware';
import CoursesController from '../controllers/courses.controller';
import ParamsValidator from '../validations/params.validator';

const router = Router();

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  CourseValidator.validateCourseCreationData(),
  CourseValidator.courseCreationValidationResult,
  CoursesMiddleware.checkCourseInexistence,
  CoursesController.createCourse,
);

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  CoursesController.fetchCourses,
);

router.patch(
  '/:courseId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseId'),
  CourseValidator.validateCourseEditData(),
  CourseValidator.courseEditValidationResult,
  CoursesMiddleware.checkCourseExistence,
  CoursesController.editCourse,
);

router.delete(
  '/:courseId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseId'),
  CoursesMiddleware.checkCourseExistence,
  CoursesController.deleteCourse,
);

router.post(
  '/past-question/:courseId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseId'),
  CourseValidator.validatePastQuestionData(),
  CourseValidator.pastQuestionValidationResult,
  CoursesMiddleware.checkPastQuestionUnlinked,
  CoursesController.linkPastQuestion,
);

router.post(
  '/subject/:courseId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseId'),
  CourseValidator.validateSubjectData(),
  CourseValidator.subjectValidationResult,
  CoursesMiddleware.checkSubjectUnlinked,
  CoursesController.linkSubject,
);

router.get(
  '/:courseId/subjects',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  ParamsValidator.validateMongooseId('courseId'),
  ParamsValidator.mongooseIdValidationResult,
  CoursesController.fetchCourseSubjects,
);

router.delete(
  '/:courseId/subjects/:subjectId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseId'),
  ParamsValidator.validateMongooseId('subjectId'),
  ParamsValidator.mongooseIdValidationResult,
  CoursesMiddleware.checkCourseSubjectLinked,
  CoursesController.deleteCourseSubject,
);

router.get(
  '/:courseId/pastquestions',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  ParamsValidator.validateMongooseId('courseId'),
  ParamsValidator.mongooseIdValidationResult,
  CoursesController.fetchCoursePastQuestions,
);

router.delete(
  '/:courseId/pastquestions/:pastQuestionId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseId'),
  ParamsValidator.validateMongooseId('pastQuestionId'),
  ParamsValidator.mongooseIdValidationResult,
  CoursesMiddleware.checkCoursePastQuestionLinked,
  CoursesController.deleteCoursePastQuestion,
);

export default router;
