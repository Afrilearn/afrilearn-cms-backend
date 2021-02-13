import { check, validationResult } from 'express-validator';
import Response from '../utils/response.utils';
import HelperUtils from '../utils/helpers.utils';

/**
 * Contains User Validators
 *
 * @class UserValidators
 */
export default class UserValidators {
  /**
   * @returns {Object} error object with errors arrays if user data is invalid
   */
  static validatePaymentPlanData() {
    return [
      check('name')
        .exists()
        .withMessage('Plan name is required')
        .isString()
        .withMessage('Plan name must be a string')
        .not()
        .isEmpty()
        .withMessage('Plan name cannot be empty'),
      check('amount')
        .exists()
        .withMessage('Plan amount is required')
        .isNumeric()
        .withMessage('Plan amount must be a number'),
      check('duration')
        .exists()
        .withMessage('Plan duration is required')
        .isNumeric()
        .withMessage('Plan duration must be a number'),
      check('category')
        .exists()
        .withMessage('Plan category is required')
        .custom(HelperUtils.validateMongooseId('Plan category')),
    ];
  }

  /**
   * @returns {JSON} JSON error object if user contains invalid data
   * @returns {next} - passes control to next function if all user data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static paymentPlanValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {Object} error object with errors arrays if password change data is invalid
   */
  static validatePaymentPlanUpdateData() {
    return [
      check('name')
        .optional()
        .isString()
        .withMessage('Plan name must be a string')
        .not()
        .isEmpty()
        .withMessage('Plan name cannot be empty'),
      check('amount')
        .optional()
        .isNumeric()
        .withMessage('Plan amount must be a number'),
      check('duration')
        .optional()
        .isNumeric()
        .withMessage('Plan duration must be a number'),
      check('category')
        .optional()
        .custom(HelperUtils.validateMongooseId('Plan category')),
    ];
  }

  /**
   * @returns {JSON} JSON error object if password creation contains invalid data
   * @returns {next} - passes control to next function if all password creation data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static paymentPlanUpdateValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
