import Question from '../db/models/questions.model';
import Response from '../utils/response.utils';

/**
 * Contains Question Middleware
 *
 * @class QuestionMiddleware
 */
export default class QuestionMiddleware {
  /**
   * @memberof QuestionMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if question doesn't exist
   * @returns {JSON} passes control to the next function if question exists
   */
  static async checkQuestionExists(req, res, next) {
    const isQuestionExists = await Question.findOne({ question: req.body.question });
    if (isQuestionExists) {
      return Response.ConflictError(res, 'question already exists');
    }
    return next();
  }
}
