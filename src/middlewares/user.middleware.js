import CmsUser from '../db/models/cmsUsers.model';
import Response from '../utils/response.utils';
import UserUtils from '../utils/user.utils';

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
      return Response.NotFoundError(res, 'User with the given id does not exist');
    }
    req.dbUser = user;
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
      return Response.ConflictError(
        res,
        'User with the given email already exists',
      );
    }
    return next();
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if passwords are equal
   * @returns {JSON} passes control to the next function if passwords are unequal
   */
  static async checkPasswordsInequality(req, res, next) {
    const passwordsEqual = await UserUtils.verifyPassword(
      req.body.password,
      req.dbUser.password,
    );
    if (passwordsEqual) {
      return Response.BadRequestError(
        res,
        'Submitted password is the same as current password',
      );
    }
    return next();
  }
}
