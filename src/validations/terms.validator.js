import { check, validationResult } from 'express-validator';
import Response from '../utils/response.utils';

/**
 * Contains Term Validations
 *
 * @class TermValidator
 */
export default class TermValidator {
  /**
   * @returns {Object} error object with errors arrays if term data is invalid
   */
  static validateTermCreationData() {
    return [
      check('name')
        .exists()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .not()
        .isEmpty()
        .withMessage('Name cannot be empty'),    
    ];
  }

  /**
   * @returns {JSON} JSON error object if term contains invalid data
   * @returns {next} - passes control to next function if all term data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async termCreationValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {Object} error object with errors arrays if course data is invalid
   */
  static validateTermEditData() {
    return [
        check('name')
        .exists()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .not()
        .isEmpty()
        .withMessage('Name cannot be empty')
    ];
  }

  /**
   * @returns {JSON} JSON error object if term contains invalid data
   * @returns {next} - passes control to next function if all term data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async termEditValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
