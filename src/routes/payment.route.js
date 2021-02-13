import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import PaymentValidator from '../validations/payment.validator';
import AuthMiddleware from '../middlewares/auth.middleware';
import ParamsValidator from '../validations/params.validator';
import PaymentMiddleware from '../middlewares/payments.middleware';

const router = Router();

router.get(
  '/plans',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  PaymentController.fetchAllPaymentPlans,
);
router.get(
  '/transactions',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  PaymentController.fetchAllPaymentTransactions,
);

router.post(
  '/plans',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  PaymentValidator.validatePaymentPlanData(),
  PaymentValidator.paymentPlanValidationResult,
  PaymentMiddleware.checkPaymentPlanInexistence,
  PaymentController.addPaymentPlan,
);

router.patch(
  '/plans/:paymentPlanId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('paymentPlanId'),
  PaymentValidator.validatePaymentPlanUpdateData(),
  PaymentValidator.paymentPlanUpdateValidationResult,
  PaymentMiddleware.checkPaymentPlanExistence,
  PaymentController.editPaymentPlan,
);

router.delete(
  '/plans/:paymentPlanId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('paymentPlanId'),
  ParamsValidator.mongooseIdValidationResult,
  PaymentMiddleware.checkPaymentPlanExistence,
  PaymentController.deletePaymentPlan,
);

export default router;
