import Courses from '../db/models/courses.model';
import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';
import Subjects from '../db/models/subjects.model';
import GeneralServices from '../services/general.services';

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
  static async checkCourseExistence(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      Courses,
      { _id: req.params.courseId },
      'Course',
    );
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if category exists
   * @returns {JSON} passes control to the next function if category doesn't exist
   */
  static async checkCourseInexistence(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      Courses,
      { name: req.body.name },
      'Course',
    );
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if related past question exists
   * @returns {Function} passes control to the next function if related
   * past question doesn't exist
   */
  static async checkPastQuestionUnlinked(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      RelatedPastQuestions,
      {
        courseId: req.params.courseId,
        pastQuestionTypeId: req.body.pastQuestionId,
      },
      'Related past question',
    );
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if related subject exists
   * @returns {Function} passes control to the next function if related
   * subject doesn't exist
   */
  static async checkSubjectUnlinked(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      Subjects,
      {
        courseId: req.params.courseId,
        mainSubjectId: req.body.mainSubjectId,
      },
      'Related subject',
    );
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if related subject doesn't exist
   * @returns {Function} passes control to the next function if related
   * subject exists
   */
  static async checkCourseSubjectLinked(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      Subjects,
      {
        courseId: req.params.courseId,
        mainSubjectId: req.params.subjectId,
      },
      'Related subject',
    );
  }

  /**
   * @memberof CoursesMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if related past question doesn't exist
   * @returns {Function} passes control to the next function if related
   * past question exists
   */
  static async checkCoursePastQuestionLinked(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      RelatedPastQuestions,
      {
        _id: req.params.pastQuestionId,
      },
      'Related past question',
    );
  }
}
