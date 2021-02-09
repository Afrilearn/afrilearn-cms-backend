import Courses from '../db/models/courses.model';
import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';
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
      Response.InternalServerError(res, 'Could not create course', err);
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

  /**
   * @memberof CoursesController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async deleteCourse(req, res) {
    try {
      await Courses.deleteOne({ _id: req.params.courseId });
      Response.Success(res, { message: 'Course deleted successfully' });
    } catch (err) {
      Response.InternalServerError(res, 'Could not delete course', err);
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async linkPastQuestion(req, res) {
    try {
      await RelatedPastQuestions.create({
        courseId: req.params.courseId,
        pastQuestionTypeId: req.body.pastQuestionId,
      });
      const course = await Courses.findOne({ _id: req.params.courseId });

      Response.Success(res, { course }, 201);
    } catch (err) {
      return Response.InternalServerError(
        res,
        'Could not link past question',
        err,
      );
    }
  }
}
