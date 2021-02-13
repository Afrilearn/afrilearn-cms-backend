import Response from '../utils/response.utils';
import Lesson from '../db/models/lessons.model';

/**
 * This class creates the lesson controller
 */
export default class LessonController {
  /**
 * Handles fetching of lessons
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async fetchAllLessons(req, res) {
    try {
      const result = await Lesson.find();

      return Response.Success(res, { lessons: result });
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching lessons');
    }
  }

  /**
 * Handles lesson editing
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async updateLesson(req, res) {
    const lessonId = req.params.id;
    try {
      const lesson = await Lesson.findOne({ _id: lessonId });
      if (!lesson) return Response.NotFoundError(res, 'Lesson does not exist');
      const lessonValues = { $set: req.body };
      await Lesson.updateOne({ _id: lessonId }, lessonValues);
      return Response.Success(res, { message: 'Lesson updated successfully' }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not update lesson');
    }
  }

  /**
 * Handles deletion of lessons
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async deleteLesson(req, res) {
    const lessonId = req.params.id;
    try {
      const lesson = await Lesson.findOne({ _id: lessonId });
      if (!lesson) { return Response.NotFoundError(res, 'lesson not found'); }
      await Lesson.deleteOne({ _id: lessonId });
      return Response.Success(res, {
        message: `${lesson.title} lesson deleted successfully`,
      }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not delete lesson');
    }
  }
}
