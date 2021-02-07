import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import SignUpValidator from '../validations/auth/signup.validator';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserMiddleware from '../middlewares/user.middleware';

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