import MajorSubject from '../db/models/mainSubjects.model';
import Response from '../utils/response.utils';

/**
 * Middleware for the major subject routes
 */
export default class MajorSubjectMiddleware {
  /**
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next | calls the next middleware in the middleware chain
   * @returns {Function} next
   */
  static async CheckSubjectExists(req, res, next) {
    const isSubjectExists = await MajorSubject.findOne({ name: req.body.name });
    if (isSubjectExists) {
      return Response.ConflictError(res, 'subject already exists');
    }
    return next();
  }
}
