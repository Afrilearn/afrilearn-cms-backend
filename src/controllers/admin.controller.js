/* eslint-disable require-jsdoc */
import EnrolledCourse from '../db/models/enrolledCourses.model';
import Response from '../utils/response.utils';

class AdminController {
  static async allEnrolledCourse(req, res) {
    const { id } = req.params;
    try {
      const courses = EnrolledCourse.find({ id });
      Response.Success(res, { courses });
    } catch (error) {
      Response.InternalServerError(res, 'Error fetching enrolled courses');
    }
  }
}

export default AdminController;
