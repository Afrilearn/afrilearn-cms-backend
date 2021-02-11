import Term from '../db/models/terms.model';
import Response from '../utils/response.utils';

/**
 * Contains Term Middleware
 *
 * @class TermMiddleware
 */
export default class TermMiddleware {
  /**
   * @memberof TermMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if term doesn't exist
   * @returns {JSON} passes control to the next function if term exists
   */
  static async checkTermExists(req, res, next) {
    const isTermExists = await Term.findOne({ name: req.body.name });
    if (isTermExists) {
      return Response.ConflictError(res, 'term already exists');
    }
    return next();
  }
}
