import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import SignInValidator from '../validations/auth/login.validator';

const router = Router();

router.post(
  '/signin',
  SignInValidator.validateData(),
  SignInValidator.myValidationResult,
  AuthController.signIn,
);

export default router;
