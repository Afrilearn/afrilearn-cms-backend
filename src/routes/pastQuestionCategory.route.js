import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import PQCategoryController from '../controllers/pastQuestionsCategory.controller';
import PQCategoryMiddleware from '../middlewares/pqCategory.middleware';
import AddPQCategoryValidator from '../validations/pastQuestionsCategory.validator';

const router = Router();

router.post(
  '',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  AddPQCategoryValidator.validateData(),
  AddPQCategoryValidator.myValidationResult,
  PQCategoryMiddleware.CheckCategoryExists,
  PQCategoryController.addCategory,
);

router.get(
  '',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  PQCategoryController.getAllCategories,
);

router.get(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209ab2792e63fc841de3c'),
  PQCategoryController.getOneCategory,
);

router.put(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  PQCategoryController.updateCategory,
);

router.delete(
  '/:id',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess('602209c32792e63fc841de3d'),
  PQCategoryController.deleteCategory,
);

export default router;
