import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import UserValidator from '../validations/user.validator';
import UserController from '../controllers/users.controller';
import ParamsValidator from '../validations/params.validator';

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

export default router;
