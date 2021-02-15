import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import UserValidator from '../validations/user.validator';
import UserController from '../controllers/users.controller';
import ParamsValidator from '../validations/params.validator';
import AfrilearnUserController from '../controllers/afrilearnUsers.controller';

const router = Router();

router.patch(
  '/:userId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserValidator.validateEditUserData(),
  UserValidator.editUserValidationResult,
  UserMiddleware.checkUserExistence,
  UserController.editUser,
);

router.delete(
  '/:userId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserMiddleware.checkUserExistence,
  UserController.deleteUser,
);

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  UserController.fetchAllCmsUsers,
);

router.get(
  '/afrilearn',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  AfrilearnUserController.fetchAllAfrilearnUsers,
);

router.get(
  '/:userId/enrolled-courses',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserController.fetchEnrolledCourses,
);

export default router;