import Response from '../utils/response.utils';
import Lesson from '../db/models/lessons.model';
import Question from '../db/models/questions.model';

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
 * Handles lesson creation
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async createLesson(req, res) {
    try {
      const result = await Lesson.create({ ...req.body });

      return Response.Success(res, { lesson: result }, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not create lesson');
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

  /**
   * View lesson quiz questions
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async viewLessonQuiz(req, res) {
    try {
      const quiz = await Question.find({ lessonId: req.params.lessonId });
      return Response.Success(res, { questions: quiz });
    } catch (error) {
      return Response.InternalServerError('Error fetching questions');
    }
  }

  /**
   * Add questions to a lesson
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async createQuiz(req, res) {
    try {
      const result = await Question.create({ ...req.body });
      return Response.Success(res, { question: result }, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'could not add quiz');
    }
  }

  /**
   * Remove question from a lesson
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async removeQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const quiz = await Question.findOne({ _id: quizId });
      if (!quiz) return Response.NotFoundError(res, 'Question does not exist');
      await Question.findByIdAndRemove(quizId);
      return Response.Success(res, { message: 'question removed successfully' });
    } catch (error) {
      return Response.InternalServerError(res, 'error removing question');
    }
  }

  /**
   * Update question
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async modifyQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const quiz = await Question.findOne({ _id: quizId });
      if (!quiz) return Response.NotFoundError(res, 'Question does not exist');
      const quizValues = { $set: req.body };
      await Question.updateOne({ _id: quizId }, quizValues);
      return Response.Success(res, { message: 'Question updated successfully' }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not update question');
    }
  }
}
