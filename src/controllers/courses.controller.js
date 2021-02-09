import Courses from '../db/models/courses.model';
import Response from '../utils/response.utils';

/**
 * Contains Courses controller
 *
 * @class CoursesController
 */
export default class CoursesController {
  /**
   * @memberof CoursesController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.internalServerError} if error occurs
   */
  static async createCourse(req, res) {
    try {
      const result = await Courses.create({ ...req.body });

      Response.Success(res, { course: result }, 201);
    } catch (err) {
      Response.InternalServerError(res, 'Could not create course');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.internalServerError} if error occurs
   */
  static async editCourse(req, res) {
    try {
      const { dbResult } = req;
      dbResult.set({ ...req.body, updatedAt: Date.now() });
      const result = await dbResult.save();

      Response.Success(res, { course: result });
    } catch (err) {
      Response.InternalServerError(res, 'Could not edit course', err);
    }
  }
}
