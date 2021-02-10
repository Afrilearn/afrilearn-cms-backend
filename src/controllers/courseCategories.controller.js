import CourseCategories from '../db/models/courseCategories.model';
import Response from '../utils/response.utils';

/**
 * Course Category controller class
 * @class CourseCategoriesController
 */
export default class CourseCategoriesController {
  /**
     * Creates course category on the database
     * @param {*} req Request
     * @param {*} res Response object
     * @returns {JSON} Created course category if successful
     * @returns {JSON} Error message if unsuccessful
     */
  static async createCourseCategory(req, res) {
    try {
      const courseCategory = await CourseCategories.create(req.body);

      Response.Success(res, { courseCategory }, 201);
    } catch (err) {
      Response.InternalServerError(res, 'Error creating course category');
    }
  }
}
