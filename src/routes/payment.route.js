import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import Validator from '../middlewares/auth.middleware';
import checkIsAdminStatus from '../middlewares/isAdmin.middleware';

const router = Router();

router.get(
  '/payment-plan',
  Validator,
  checkIsAdminStatus,
  PaymentController.getAllPaymentPlan,
);

router.post(
  '/add-payment-plan',
  Validator,
  checkIsAdminStatus,
  PaymentController.addPaymentPlan,
);

router.put(
  '/edit-payment-plan',
  Validator,
  checkIsAdminStatus,
  PaymentController.modifyPaymentPlan,
);

router.delete(
  '/remove-payment-plan',
  Validator,
  checkIsAdminStatus,
  PaymentController.removePlan,
);

export default router;
