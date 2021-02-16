import PaymentPlans from '../db/models/paymentPlans.model';
import GeneralServices from '../services/general.services';
import Users from '../db/models/users.model';
/**
 * Contains Courses Middleware
 *
 * @class CoursesMiddleware
 */
export default class CoursesMiddleware {
  /**
   * @memberof CoursesMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if course doesn't exist
   * @returns {JSON} passes control to the next function if course exists
   */
  static async checkPaymentPlanExistence(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      PaymentPlans,
      { _id: req.params.paymentPlanId },
      'This payment plan',
    );
  }

  /**
   * @memberof PaymentMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if category exists
   * @returns {JSON} passes control to the next function if category doesn't exist
   */
  static async checkPaymentPlanInexistence(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      PaymentPlans,
      { name: req.body.name },
      'This payment plan',
    );
  }

  /**
   * @memberof PaymentMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if user exists
   * @returns {JSON} passes control to the next function if user doesn't exist
   */
  static async fetchEmailUser(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      Users,
      { email: req.body.email },
      'The user',
    );
  }
}
