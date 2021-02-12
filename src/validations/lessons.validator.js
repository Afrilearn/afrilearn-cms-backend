import { check, validationResult } from "express-validator";
import Response from "../utils/response.utils";
import HelperUtils from "../utils/helpers.utils";

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
      check("creatorId")
        .not()
        .exists()
        .withMessage("Cannot change lesson creator"),
      check("title")
        .optional()
        .isString()
        .withMessage("Title must be a string")
        .not()
        .isEmpty()
        .withMessage("Title cannot be empty"),
      check("content")
        .optional()
        .isString()
        .withMessage("Content must be a string"),
      check("termId")
        .optional()
        .custom(HelperUtils.validateMongooseId("Term id"))
        .not()
        .isEmpty()
        .withMessage("Term Id cannot be empty"),
      check("courseId")
        .optional()
        .custom(HelperUtils.validateMongooseId("Course id"))
        .not()
        .isEmpty()
        .withMessage("Course Id cannot be empty"),
      check("subjectId")
        .optional()
        .custom(HelperUtils.validateMongooseId("Subject id"))
        .not()
        .isEmpty()
        .withMessage("Subject Id cannot be empty"),
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


  static async validateQuiz() {
    return [
      check("lessonId")
        .exists()
        .withMessage("Lesson id is required")
        .custom(HelperUtils.validateMongooseId("Term id")),
      check("creatorId")
        .exists()
        .withMessage("Creator id is required")
        .custom(HelperUtils.validateMongooseId("Term id")),
      check("question")
        .exists()
        .withMessage("Question is required")
        .notEmpty()
        .withMessage("Question is cannot be empty")
        .isString()
        .withMessage("Question must be a string"),
      check("options")
        .isArray()
        .withMessage("Options must be an array")
        .exists()
        .withMessage("Options are required")
        .isLength({ min: 2 })
        .withMessage("Options cannot be one"),
      check("images").isArray().withMessage("Images must be an array"),
      check("correctOption")
        .isNumeric()
        .withMessage("Correct option must be a number")
        .exists()
        .withMessage("Correct option is required"),
      check("questionPosition").custom((val) => {
        return (
          val === "above" ||
          val === "below" ||
          "Question position has to be either 'above' or 'below'"
        );
      }),
      check("explanation")
        .isString()
        .withMessage("Explanation must be a string")
        .notEmpty()
        .withMessage("Explanation cannot be empty"),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async quizValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  static async validateQuizUpdate() {
    return [
      check("lessonId")
        .custom(HelperUtils.validateMongooseId("Term id")),
      check("question")
        .notEmpty()
        .withMessage("Question is cannot be empty")
        .isString()
        .withMessage("Question must be a string"),
      check("options")
        .isArray()
        .withMessage("Options must be an array")
        .isLength({ min: 2 })
        .withMessage("Options cannot be one"),
      check("images").isArray().withMessage("Images must be an array"),
      check("correctOption")
        .isNumeric()
        .withMessage("Correct option must be a number"),
      check("questionPosition").custom((val) => {
        return (
          val === "above" ||
          val === "below" ||
          "Question position has to be either 'above' or 'below'"
        );
      }),
      check("explanation")
        .isString()
        .withMessage("Explanation must be a string")
        .notEmpty()
        .withMessage("Explanation cannot be empty"),
    ];
  }

  /**
   * @returns {JSON} JSON error object if course contains invalid data
   * @returns {next} - passes control to next function if all course data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static async quizUpdateValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
