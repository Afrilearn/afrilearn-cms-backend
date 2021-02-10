import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import SignUpValidator from '../validations/auth/signup.validator';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import UserValidator from '../validations/user.validator';
import UserController from '../controllers/users.controller';
import SignInValidator from '../validations/auth/login.validator';

const router = Router();
router.post(
  '/signup',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  SignUpValidator.validateSignupData(),
  SignUpValidator.signupValidationResult,
  UserMiddleware.checkUserInexistence,
  AuthController.signup,
);

router.patch(
  '/change_password',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  UserValidator.validateChangePasswordData(),
  UserValidator.changePasswordValidationResult,
  UserMiddleware.checkUserExistence,
  UserMiddleware.checkPasswordsInequality,
  UserController.changePassword,
);
router.post(
  '/signin',
  SignInValidator.validateData(),
  SignInValidator.myValidationResult,
  AuthController.signIn,
);

export default router;
