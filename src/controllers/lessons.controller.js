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
  
  /**
   * Create account for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */

  static async addVideo(req, res) {
    const { _id, videoUrl } = req.body;
    try {
      const result = await Lesson.updateOne(
        { _id },
        { $addToSet: { videoUrls: [...videoUrl] } },
      );
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error: error.message,
      });
    }
  }

  /**
   * Create account for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */

  static async viewQuiz(req, res) {
    try {
      const quiz = await Question.find();
      res.status(200).json({
        status: 'success',
        data: quiz,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  }

  /**
   * Create account for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */

  static async createQuiz(req, res) {
    const { _id } = req.data;
    const {
      lessonId,
      question,
      question_image,
      question_position,
      options,
      images,
      correct_option,
      explanation,
    } = req.body;

    try {
      const newQuiz = await Question.create({
        lessonId,
        creator_Id: _id,
        question,
        question_image,
        question_position,
        options,
        images,
        correct_option,
        explanation,
      });
      newQuiz.save();
      res.status(201).json({
        status: 'success',
        data: newQuiz,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  }

  static async removeQuiz(req, res) {
    const { quizId } = req.params;

    try {
      const result = await Question.findByIdAndRemove(quizId);
      res.status(202).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  }

  static async modifyQuiz(req, res) {
    const { quizId } = req.params;
    const {
      question,
      question_image,
      question_position,
      options,
      images,
      correct_option,
      explanation,
    } = req.body;

    const newDoc = {
      question,
      question_image,
      question_position,
      options,
      images,
      correct_option,
      explanation,
    };

    try {
      const updatedDoc = Question.findByIdAndUpdate(quizId, newDoc, { new: true });
      res.status(201).json({
        status: 'success',
        data: updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  }
}
