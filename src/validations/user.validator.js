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
  static validateEditUserData() {
    return [
      check('firstName')
        .optional()
        .isString()
        .withMessage('First name must be a string')
        .not()
        .isEmpty()
        .withMessage('First name cannot be empty'),
      check('lastName')
        .optional()
        .isString()
        .withMessage('Last name must be a string')
        .not()
        .isEmpty()
        .withMessage('Last name cannot be empty'),
      check('email').optional().isEmail().withMessage('Invalid email address'),
      check('password')
        .not()
        .exists()
        .withMessage('Cannot change password through this endpoint'),
      check('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .not()
        .isEmpty()
        .withMessage('Role cannot be empty')
        .custom(HelperUtils.validateMongooseId('Role')),
    ];
  }

  /**
   * @returns {JSON} JSON error object if user contains invalid data
   * @returns {next} - passes control to next function if all user data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async editUserValidationResult(req, res, next) {
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
  static validateChangePasswordData() {
    return [
      check('userId')
        .exists()
        .withMessage('User id is required')
        .isString()
        .withMessage('User id must be a string')
        .not()
        .isEmpty()
        .withMessage('User id cannot be empty')
        .custom(HelperUtils.validateMongooseId('User id')),
      check('password')
        .exists()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password length must be at least 8 characters')
        .trim()
        .escape(),
    ];
  }

  /**
   * @returns {JSON} JSON error object if password creation contains invalid data
   * @returns {next} - passes control to next function if all password creation data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static changePasswordValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
