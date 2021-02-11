import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import CourseCategoryValidator from '../validations/courseCategories.validator';
import CourseCategoriesMiddleware from '../middlewares/courseCategories.middleware';
import CourseCategoriesController from '../controllers/courseCategories.controller';
import ParamsValidator from '../validations/params.validator';

const router = Router();

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  CourseCategoryValidator.validateCourseCategoryData(),
  CourseCategoryValidator.courseCategoryValidationResult,
  CourseCategoriesMiddleware.checkCourseCategoryInexistence,
  CourseCategoriesController.createCourseCategory,
);

router.patch(
  '/:courseCategoryId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('courseCategoryId'),
  CourseCategoryValidator.validateCourseCategoryData(),
  CourseCategoryValidator.courseCategoryValidationResult,
  CourseCategoriesMiddleware.checkCourseCategoryExistence,
  CourseCategoriesController.editCourseCategory,
);

export default router;
