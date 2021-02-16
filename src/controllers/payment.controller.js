/* eslint-disable require-jsdoc */
import PaymentPlans from '../db/models/paymentPlans.model';
import Transactions from '../db/models/transaction.model';
import EnrolledCourses from '../db/models/enrolledCourses.model';
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
      const paymentTransactions = await Transactions.find();
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
        name,
        amount,
        duration,
        category,
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

  static async payManually(req, res) {
    try {
      const userId = req.dbResult._id;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + req.body.paymentPlan.duration * 30);
      const enrolledCourse = await EnrolledCourses.create({
        userId,
        courseId: req.body.courseId,
        classId: req.body.classId,
        startDate,
        endDate,
      });

      const transactionUpload = await Transactions.create({
        tx_ref: req.body.transactionRef,
        amount: req.body.paymentPlan.amount,
        status: 'successful',
        userId,
        enrolledCourseId: enrolledCourse._id,
        paymentPlanId: req.body.paymentPlan._id,
      });

      const transaction = await Transactions.findById(transactionUpload._id).populate(
        'userId paymentPlanId',
        'fullName email name duration amount',
      );

      Response.Success(res, { transaction }, 201);
    } catch (error) {
      Response.InternalServerError(res, 'Error activating payment');
    }
  }
}

export default PaymentController;
