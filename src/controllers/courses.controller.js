import Courses from '../db/models/courses.model';
import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';
import Subjects from '../db/models/subjects.model';
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
      Response.InternalServerError(res, 'Error creating course');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} on success, returns all courses
   * @returns {Response.internalServerError} on error, returns json error object
   */
  static async fetchCourses(req, res) {
    try {
      const courses = await Courses.find();

      Response.Success(res, { courses });
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching courses');
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
      dbResult.set({ ...req.body });
      const result = await dbResult.save();

      Response.Success(res, { course: result });
    } catch (err) {
      Response.InternalServerError(res, 'Error editing course');
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
      Response.InternalServerError(res, 'Error deleting course');
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
      const course = await Courses.findById(req.params.courseId).populate({
        path: 'relatedPastQuestions',
        populate: { path: 'pastQuestionTypeId' },
      });

      Response.Success(res, { course }, 201);
    } catch (err) {
      return Response.InternalServerError(res, 'Error linking past question');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async linkSubject(req, res) {
    try {
      await Subjects.create({
        courseId: req.params.courseId,
        mainSubjectId: req.body.mainSubjectId,
      });

      const course = await Courses.findById(req.params.courseId).populate({
        path: 'relatedSubjects',
        populate: { path: 'mainSubjectId' },
      });

      Response.Success(res, { course }, 201);
    } catch (err) {
      return Response.InternalServerError(res, 'Error linking subject');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @returns {Response.Success} returns array of populated course subject
   * @returns {Response.InternalServerError} if error occurs
   */
  static async fetchCourseSubjects(req, res) {
    try {
      const courseSubjects = await Subjects.find({
        courseId: req.params.courseId,
      }).populate('mainSubjectId');

      Response.Success(res, { courseSubjects });
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching course subjects');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if successful course subject is deleted succesfully
   * @returns {Response.InternalServerError} if error occurs
   */
  static async deleteCourseSubject(req, res) {
    try {
      await Subjects.deleteOne({
        courseId: req.params.courseId,
        mainSubjectId: req.params.subjectId,
      });

      Response.Success(res, {
        message: 'The subject has been deleted successfully',
      });
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting course subjects');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @returns {Response.Success} returns array of populated past questions
   * @returns {Response.InternalServerError} if error occurs
   */
  static async fetchCoursePastQuestions(req, res) {
    try {
      const pastQuestions = await RelatedPastQuestions.find({
        courseId: req.params.courseId,
      }).populate('pastQuestionTypeId');

      Response.Success(res, { pastQuestions });
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching course past questions');
    }
  }

  /**
   * @memberof CoursesController
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if successful, past question is deleted succesfully
   * @returns {Response.InternalServerError} if error occurs
   */
  static async deleteCoursePastQuestion(req, res) {
    try {
      await RelatedPastQuestions.deleteOne({
        _id: req.params.pastQuestionId,
      });

      Response.Success(res, {
        message: 'The past question has been deleted successfully',
      });
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting past question');
    }
  }
}
