import GeneralServices from '../services/general.services';
import CourseCategories from '../db/models/courseCategories.model';

/**
 * Course Category Middleware class
 * @class CourseCategoryMiddleware
 */
export default class CourseCategoryMiddleware {
  /**
   * Checks if course category with the given name doesn't exist
   * @param {*} req Request
   * @param {*} res Response object
   * @param {*} next Passes control to next function
   * @returns {JSON} error if it exists
   * @returns {Function} (next) passes control to next function
   */
  static checkCourseCategoryInexistence(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      CourseCategories,
      { name: req.body.name },
      'This course category',
    );
  }

  /**
   * Checks if course category with the given name exists
   * @param {*} req Request
   * @param {*} res Response object
   * @param {*} next Passes control to next function
   * @returns {JSON} error if it doesn't exist
   * @returns {Function} (next) Populates req.dbResult with fetched doc
   * and passes control to next function
   */
  static checkCourseCategoryExistence(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      CourseCategories,
      { _id: req.params.courseCategoryId },
      'This course category',
    );
  }
}
