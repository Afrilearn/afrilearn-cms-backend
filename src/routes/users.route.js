import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import UserValidator from '../validations/user.validator';
import UserController from '../controllers/users.controller';

const router = Router();

router.patch(
  '/:userId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  UserValidator.validateEditUserData(),
  UserValidator.editUserValidationResult,
  UserMiddleware.checkUserExistence,
  UserController.editUser,
);

export default router;
