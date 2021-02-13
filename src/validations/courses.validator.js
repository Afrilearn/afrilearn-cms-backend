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
  static courseCreationValidationResult(req, res, next) {
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
  static validateCourseEditData() {
    return [
      check('creatorId')
        .not()
        .exists()
        .withMessage('Cannot change course creator'),
      check('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .not()
        .isEmpty()
        .withMessage('Name cannot be empty'),
      check('alias')
        .optional()
        .isString()
        .withMessage('Alias must be a string')
        .not()
        .isEmpty()
        .withMessage('Alias cannot be empty'),
      check('categoryId')
        .optional()
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
  static courseEditValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {Object} error object with errors arrays if past question id is invalid
   */
  static validatePastQuestionData() {
    return [
      check('pastQuestionId')
        .exists()
        .withMessage('Past question id is required')
        .notEmpty()
        .withMessage('Past question id cannot be empty')
        .isString()
        .withMessage('Past question id must be a string')
        .custom(HelperUtils.validateMongooseId('Past question id')),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static pastQuestionValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {Object} error object with errors arrays if past question id is invalid
   */
  static validateSubjectData() {
    return [
      check('mainSubjectId')
        .exists()
        .withMessage('Subject id is required')
        .notEmpty()
        .withMessage('Subject id cannot be empty')
        .isString()
        .withMessage('Subject id must be a string')
        .custom(HelperUtils.validateMongooseId('Subject id')),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static subjectValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
