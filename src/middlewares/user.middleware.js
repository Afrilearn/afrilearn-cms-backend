import CmsUser from '../db/models/cmsUsers.model';
import Response from '../utils/response.utils';

/**
 * Contains Users Middlewares
 *
 * @classUsersMiddleware
 */
export default class UsersMiddleware {
  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if user doesn't exist
   * @returns {JSON} passes control to the next function if user exists
   */
  static async checkUserExistence(req, res, next) {
    const condition = { _id: req.body.userId || req.params.userId };
    const user = await CmsUser.findOne(condition);
    if (!user) {
      return Response.NotFound(res, 'User with the given id does not exist');
    }
    req.body.dbUser = user;
    return next();
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if user exists
   * @returns {JSON} passes control to the next function if doesn't doesn't exist
   */
  static async checkUserInexistence(req, res, next) {
    const condition = { email: req.body.email };
    const user = await CmsUser.findOne(condition);
    if (user) {
      return Response.ConflictingRequest(
        res,
        'User with the given email already exists',
      );
    }
    return next();
  }
}
