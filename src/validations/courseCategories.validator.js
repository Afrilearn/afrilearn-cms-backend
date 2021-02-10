import { check, validationResult } from 'express-validator';
import Response from '../utils/response.utils';

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class courseCategoryValidator {
  /**
     * @returns {Array} Array of errors if course category data is invalid
     * @returns {EmptyArray} Empty array if course category data is valid
     */
  static validateCourseCategoryData() {
    return [
      check('name')
        .exists()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
        .not()
        .isEmpty()
        .withMessage('Category name cannot be empty'),
    ];
  }

  /**
   * @returns {JSON} JSON error object if req contains error
   * @returns {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async courseCategoryValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
