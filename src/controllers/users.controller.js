import Response from '../utils/response.utils';

/**
 *Contains Users Controller
 *
 *
 * @class UsersController
 */
export default class UserController {
  /**
   * @memberof UserController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async editUser(req, res) {
    try {
      const { dbUser, ...update } = req.body;
      dbUser.set(update);
      const result = await dbUser.save();

      Response.Success(res, { user: result });
    } catch (err) {
      return Response.InternalServerError(res, 'Could not edit user', err);
    }
  }
}
