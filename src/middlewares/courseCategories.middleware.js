import GeneralServices from '../services/general.services';
import CourseCategories from '../db/models/courseCategories.model';

/**
 * Course Category Middleware class
 * @class CourseCategoryMiddleware
 */
export default class CourseCategoryMiddleware {
  /**
     * Checks if course category with the given name already exists
     * @param {*} req Request
     * @param {*} res Response object
     * @param {*} next Passes control to next function
     * @returns {JSON} error if process fails
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
}
