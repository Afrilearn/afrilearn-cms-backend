/* eslint-disable require-jsdoc */
import EnrolledCourse from '../db/models/enrolledCourses.model';

class AdminController {
  static async allEnrolledCourse(req, res) {
    const { id } = req.params;
    try {
      const courses = EnrolledCourse.find({ id });
      res.status(200).json({
        status: 'success',
        data: courses,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        data: error.message,
      });
    }
  }
}

export default AdminController;
