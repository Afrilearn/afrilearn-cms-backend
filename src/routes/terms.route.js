import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import TermValidator from '../validations/terms.validator';
import TermMiddleware from '../middlewares/terms.middleware';
import TermController from '../controllers/terms.controller';
import ParamsValidator from '../validations/params.validator';

const router = Router();

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  TermController.fetchAllTerms,
);

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  TermValidator.validateTermCreationData(),
  TermValidator.termCreationValidationResult,
  TermMiddleware.checkTermExists,
  TermController.createTerm,
);

router.put(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('id'),
  TermValidator.validateTermEditData(),
  TermValidator.termEditValidationResult,
  TermMiddleware.checkTermExists,
  TermController.editTerm,
);

router.delete(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  ParamsValidator.validateMongooseId('id'),
  TermController.deleteTerm,
);

export default router;
