import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import CourseValidator from '../validations/courses.validator';
import CoursesMiddleware from '../middlewares/courses.middleware';
import CoursesController from '../controllers/courses.controller';

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

export default router;
