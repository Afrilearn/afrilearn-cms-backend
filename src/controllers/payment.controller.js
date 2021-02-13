/* eslint-disable require-jsdoc */
import PaymentPlans from '../db/models/paymentPlans.model';
import Payment from '../db/models/payments.model';
import Response from '../utils/response.utils';

class PaymentController {
  static async fetchAllPaymentPlans(req, res) {
    try {
      const paymentPlans = await PaymentPlans.find();
      Response.Success(res, { paymentPlans });
    } catch (error) {
      Response.InternalServerError(res, 'Error fetching payment plans');
    }
  }

  static async fetchAllPaymentTransactions(req, res) {
    try {
      const paymentTransactions = await Payment.find();
      Response.Success(res, { paymentTransactions });
    } catch (error) {
      Response.InternalServerError(res, 'Error fetching payment transactions');
    }
  }

  static async addPaymentPlan(req, res) {
    try {
      const {
        name, amount, duration, category,
      } = req.body;
      const paymentPlan = await PaymentPlans.create({
        name, amount, duration, category,
      });
      Response.Success(res, { paymentPlan }, 201);
    } catch (error) {
      Response.InternalServerError(res, 'Error creating payment plan');
    }
  }

  static async editPaymentPlan(req, res) {
    try {
      const { name, amount, duration } = req.body;
      const { dbResult } = req;
      dbResult.set({
        name,
        amount,
        duration,
      });
      const paymentPlan = await dbResult.save();

      Response.Success(res, { paymentPlan });
    } catch (error) {
      Response.InternalServerError(res, 'Error editing payment plan');
    }
  }

  static async deletePaymentPlan(req, res) {
    try {
      const { id } = req.params;
      await PaymentPlans.findByIdAndRemove(id);

      Response.Success(res, { message: 'Payment plan deleted successfully' });
    } catch (error) {
      Response.InternalServerError(res, 'Error deleting payment plan');
    }
  }
}

export default PaymentController;
