import { check, validationResult } from 'express-validator';
import Response from '../utils/response.utils';
import HelperUtils from '../utils/helpers.utils';

/**
 * Contains Course Validations
 *
 * @class CourseValidator
 */
export default class CourseValidator {
  /**
   * @returns {Object} error object with errors arrays if course data is invalid
   */
  static validateCourseCreationData() {
    return [
      check('name')
        .exists()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .not()
        .isEmpty()
        .withMessage('Name cannot be empty'),
      check('alias')
        .exists()
        .withMessage('Alias is required')
        .isString()
        .withMessage('Alias must be a string')
        .not()
        .isEmpty()
        .withMessage('Alias cannot be empty'),
      check('creatorId')
        .exists()
        .withMessage('Creator id is required')
        .isString()
        .withMessage('Creator id must be a string')
        .not()
        .isEmpty()
        .withMessage('Creator id cannot be empty')
        .custom(HelperUtils.validateMongooseId('Creator id')),
      check('categoryId')
        .exists()
        .withMessage('Category is required')
        .isString()
        .withMessage('Category id must be a string')
        .not()
        .isEmpty()
        .withMessage('Category cannot be empty')
        .custom(HelperUtils.validateMongooseId('Category id')),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async courseCreationValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidDataRequest(res, errArr);
    }
    return next();
  }
}
