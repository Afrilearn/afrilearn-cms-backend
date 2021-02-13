import Courses from '../db/models/courses.model';
import Subjects from '../db/models/mainSubjects.model';
import AfrilearnUsers from '../db/models/users.model';
import Response from '../utils/response.utils';
import Questions from '../db/models/questions.model';
import EnrolledCourses from '../db/models/enrolledCourses.model';

export default class CountsController {
  static async fetchAllCounts(req, res) {
    try {
      const courses = await Courses.countDocuments();
      const students = await AfrilearnUsers.countDocuments({
        role: '5fd08fba50964811309722d5',
      });
      const teachers = await AfrilearnUsers.countDocuments({
        role: '5fc8cc978e28fa50986ecac9',
      });
      const admins = await AfrilearnUsers.countDocuments({
        role: '6014126a3636dc4398df7cc4',
      });
      const subjects = await Subjects.countDocuments();
      const quizzes = await Questions.countDocuments();
      const subscribedUsers = await EnrolledCourses.countDocuments({
        endDate: { $gt: Date.now() },
      });
      const unsubscribedUsers = await EnrolledCourses.countDocuments({
        endDate: { $lt: Date.now() },
      });

      Response.Success(res, {
        counts: {
          courses,
          afrilearnUsers: {
            students,
            teachers,
            admins,
            total: admins + students + teachers,
          },
          subjects,
          quizzes,
          subscribedUsers,
          unsubscribedUsers,
        },
      });
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching database counts');
    }
  }
}
