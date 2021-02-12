import PQCategory from '../db/models/pastQuestionTypes.model';
import Response from '../utils/response.utils';

/**
 * Middleware for the past question category routes
 */
export default class PQCategoryMiddleware {
  /**
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next | calls the next middleware in the middleware chain
   * @returns {Function} next
   */
  static async CheckCategoryExists(req, res, next) {
    const isCategoryExists = await PQCategory.findOne({ name: req.body.name });
    if (isCategoryExists) {
      return Response.ConflictError(res, 'category already exists');
      }    
    return next();
    }
}
