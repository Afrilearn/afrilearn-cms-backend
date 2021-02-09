import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware'
import PQCategoryController from '../controllers/pastquestions_category.controller';
import PQCategoryMiddleware from '../middlewares/pqCategory.middleware';
import AddPQCategoryValidator from '../validations/pqCategory/addPQCategory.validator'

const router = Router();


router.post(
  '/pqcategory',
  AuthMiddleware.verifyUserToken,
  AuthMiddleware.verifyManager,
  AddPQCategoryValidator.validateData(),
  AddPQCategoryValidator.myValidationResult,
  PQCategoryMiddleware.CheckCategoryExists,
  PQCategoryController.addCategory,
);

router.get(
    '/pqcategory',
    AuthMiddleware.verifyUserToken,
    PQCategoryController.getAllCategories,
  );

router.get(
  '/pqcategory/:id',
  AuthMiddleware.verifyUserToken,
  PQCategoryController.getOneCategory,
);

router.put(
  '/pqcategory/:id',
  AuthMiddleware.verifyUserToken,
  AuthMiddleware.verifyManager,
  PQCategoryController.updateCategory
)

router.delete(
    '/pqcategory/:id',
    AuthMiddleware.verifyUserToken,
    AuthMiddleware.verifyManager,
    PQCategoryController.deleteCategory,
  );

export default router;
