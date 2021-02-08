import Response from '../utils/response.utils';
import CmsUsers from '../db/models/cmsUsers.model';

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

  /**
   * @memberof UserController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async deleteUser(req, res) {
    try {
      await CmsUsers.findByIdAndDelete(req.params.userId);

      Response.Success(res, { message: 'User deleted successfully' });
    } catch (err) {
      return Response.InternalServerError(res, 'Could not delete user', err);
    }
  }
}
