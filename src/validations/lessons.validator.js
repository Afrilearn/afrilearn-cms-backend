import { check, validationResult } from 'express-validator';
import Response from '../utils/response.utils';
import HelperUtils from '../utils/helpers.utils';

/**
 * Contains Lesson Validations
 *
 * @class LessonValidator
 */
export default class LessonValidator {
  /**
   * @returns {Object} error object with errors arrays if lesson data is invalid
   */
  static validateLessonEditData() {
    return [
      check('creatorId')
        .not()
        .exists()
        .withMessage('Cannot change lesson creator'),
      check('title')
        .optional()
        .isString()
        .withMessage('Title must be a string')
        .not()
        .isEmpty()
        .withMessage('Title cannot be empty'),
      check('content')
        .optional()
        .isString()
        .withMessage('Content must be a string'),
      check('termId')
        .optional()
        .custom(HelperUtils.validateMongooseId('Term id'))
        .not()
        .isEmpty()
        .withMessage('Term Id cannot be empty'),
      check('courseId')
        .optional()
        .custom(HelperUtils.validateMongooseId('Course id'))
        .not()
        .isEmpty()
        .withMessage('Course Id cannot be empty'),
      check('subjectId')
        .optional()
        .custom(HelperUtils.validateMongooseId('Subject id'))
        .not()
        .isEmpty()
        .withMessage('Subject Id cannot be empty'),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static lessonEditValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
