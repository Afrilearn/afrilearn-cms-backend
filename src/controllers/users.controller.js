import Response from '../utils/response.utils';
import CmsUsers from '../db/models/cmsUsers.model';
import UsersUtils from '../utils/user.utils';

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
      const { dbUser } = req;
      dbUser.set({ ...req.body, updatedAt: Date.now() });
      const user = await dbUser.save();

      Response.Success(res, { user });
    } catch (err) {
      return Response.InternalServerError(res, 'Error editing user');
    }
  }

  /**
   * @memberof UserController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async changePassword(req, res) {
    try {
      const { password } = req.body;

      const encryptpassword = await UsersUtils.encryptPassword(password);

      await CmsUsers.findByIdAndUpdate(req.body.userId, {
        password: encryptpassword,
      });

      Response.Success(res, { message: 'Password changed successfully' });
    } catch (err) {
      return Response.InternalServerError(res, 'Error changing password');
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
      return Response.InternalServerError(res, 'Error deleting user');
    }
  }

  /**
   * @memberof UserController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async fetchAllCmsUsers(req, res) {
    try {
      const users = await CmsUsers.find();

      return Response.Success(res, { users });
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching cms users');
    }
  }
}
