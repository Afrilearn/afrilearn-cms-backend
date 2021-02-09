/* eslint-disable require-jsdoc */
import PaymentPlan from '../db/models/paymentPlans.model';
import CourseCategory from '../db/models/courseCategories.model';

class PaymentController {
  static async getAllPaymentPlan(req, res) {
    try {
      const plans = PaymentPlan.find();
      res.status(200).json({
        status: 'success',
        data: plans,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  static async addPaymentPlan(req, res) {
    const {
      name, amount, duration, category,
    } = req.body;
    try {
      const isCategory = CourseCategory.findOne(category);
      let catId;
      if (isCategory) {
        catId = isCategory._id;
      }
      const newCategory = new PaymentPlan({
        name,
        amount,
        duration,
        category: catId,
      });
      const plans = await newCategory.save();
      res.status(201).json({
        status: 'success',
        data: plans,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  static async modifyPaymentPlan(req, res) {
    const { name, amount, duration } = req.body;
    const { _id } = req.params;
    try {
      const editedPlan = await PaymentPlan.findOneAndUpdate(
        { _id },
        {
          name,
          amount,
          duration,
        },
      );

      res.status(201).json({
        status: 'success',
        data: editedPlan,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  static async removePlan(req, res) {
    const { _id } = req.params;
    try {
      const removed = PaymentPlan.findByIdAndRemove(_id);

      res.status(204).json({
        status: 'success',
        data: removed,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        data: error.message,
      });
    }
  }
}

export default PaymentController;
