/* eslint-disable require-jsdoc */
import Lesson from '../db/models/lessons.model';
import Question from '../db/models/questions.model';

/**
 * @Class LessonController
 *
 * handles the read and write to the lesson document
 */

class LessonController {
  /**
   * Create account for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */

  static async addVideo(req, res) {
    const { id, videoUrl } = req.body;
    try {
      const result = await Lesson.updateOne(
        { _id: id },
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
    const { id } = req.data;
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
        creator_Id: id,
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

  static async remove(req, res) {
    const { id } = req.params;

    try {
      const result = await Question.findByIdAndRemove(id);
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

  static async modify(req, res) {
    const { id } = req.params;
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
      const updatedDoc = Question.findByIdAndUpdate(id, newDoc, { new: true });
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

export default LessonController;
