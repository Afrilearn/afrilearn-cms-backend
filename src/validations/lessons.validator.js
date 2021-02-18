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
   * @returns {JSON} JSON error object if lesson contains invalid data
   * @returns {next} - passes control to next function if all lesson data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static validateLessonCreationData() {
    return [
      check('creatorId')
        .optional()
        .notEmpty()
        .withMessage('CreatorId cannot be empty')
        .custom(HelperUtils.validateMongooseId('Creator Id')),
      check('title')
        .exists()
        .withMessage('Title is required')
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isString()
        .withMessage('Title must be a string'),
      check('content')
        .optional()
        .isString()
        .withMessage('Content must be a string'),
      check('termId')
        .exists()
        .withMessage('Term Id is required')
        .notEmpty()
        .withMessage('Term Id cannot be empty')
        .custom(HelperUtils.validateMongooseId('Term id')),
      check('courseId')
        .exists()
        .withMessage('Course Id is required')
        .notEmpty()
        .withMessage('Course Id cannot be empty')
        .custom(HelperUtils.validateMongooseId('Course id')),
      check('creatorId')
        .exists()
        .withMessage('Creator Id is required')
        .notEmpty()
        .withMessage('Creator Id cannot be empty')
        .custom(HelperUtils.validateMongooseId('Creator id')),
      check('subjectId')
        .exists()
        .withMessage('Subject Id is required')
        .notEmpty()
        .withMessage('Subject Id cannot be empty')
        .custom(HelperUtils.validateMongooseId('Subject id'))
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async lessonCreationValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {JSON} JSON error object if lesson contains invalid data
   * @returns {next} - passes control to next function if all lesson data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
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
  static async lessonEditValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {JSON} JSON error object if lesson contains invalid data
   * @returns {next} - passes control to next function if all lesson data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static validateQuiz() {
    return [
      check('lessonId')
        .exists()
        .withMessage('Lesson id is required')
        .custom(HelperUtils.validateMongooseId('Lesson id')),
      check('creator_Id')
        .exists()
        .withMessage('Creator id is required')
        .custom(HelperUtils.validateMongooseId('Creator id')),
      check('questionsArray')
        .exists()
        .withMessage('Questions Array is required')
        .withMessage('Questions Array cannot be empty'),
        check("questionsArray.*.question") 
        .exists()
        .withMessage('Question is required')
        .notEmpty()
        .withMessage('Question cannot be empty')
        .isString()
        .withMessage('Question must be a string'),
        check("questionsArray.*.options") 
        .isArray()
        .withMessage('Options must be an array')
        .exists()
        .withMessage('Options are required')
        .isLength({ min: 2 })
        .withMessage('Options must be more than one'),
        check("questionsArray.*.images") .optional()
        .isArray().withMessage('Images must be an array'),
        check("questionsArray.*.correct_option") 
        .exists()
        .withMessage('Correct option is required')
        .isNumeric()
        .withMessage('Correct option must be a number'),
        check("questionsArray.*.questionPosition") .custom((val) => (
        val === 'above'
          || val === 'below'
          || "Question position has to be either 'above' or 'below'"
      )),
      check("questionsArray.*.explanation") 
        .isString()
        .withMessage('Explanation must be a string')
        .not()
        .isEmpty()
        .withMessage('Explanation cannot be empty'),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static quizValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {JSON} JSON error object if question contains invalid data
   * @returns {next} - passes control to next function if all question data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static validateQuizUpdate() {
    return [
      check('lessonId')
        .optional()
        .custom(HelperUtils.validateMongooseId('Lesson id')),
        check('questionsArray')
        .optional()     
        .isLength({ min: 1 })
        .withMessage('Questions Array cannot be empty'),
        check("questionsArray.*.question")
        .optional() 
        .notEmpty()
        .withMessage('Question cannot be empty')
        .isString()
        .withMessage('Question must be a string'),
        check("questionsArray.*.options") 
        .optional()
        .isArray()
        .withMessage('Options must be an array')
        .isLength({ min: 2 })
        .withMessage('Options must be more than one'),
        check("questionsArray.*.images") .optional()
        .isArray().withMessage('Images must be an array'),
        check("questionsArray.*.correct_option") 
        .optional()
        .isNumeric()
        .withMessage('Correct option must be a number'),
        check("questionsArray.*.questionPosition") .custom((val) => (
        val === 'above'
          || val === 'below'
          || "Question position has to be either 'above' or 'below'"
      )),
      check("questionsArray.*.explanation") 
        .optional()
        .isString()
        .withMessage('Explanation must be a string')
        .not()
        .isEmpty()
        .withMessage('Explanation cannot be empty'),
    ];
  }

  /**
   * @returns {JSON} JSON error object if question contains invalid data
   * @returns {next} - passes control to next function if all question data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static quizUpdateValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}