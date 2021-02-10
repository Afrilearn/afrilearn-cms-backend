import Users from '../db/models/users.model';
import Response from '../utils/response.utils';

/**
 * Contains AfrilearnUsers controller
 *
 *
 *
 * @class UserController
 */
export default class UserController {
  /**
   * @memberof UserController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async fetchAllAfrilearnUsers(req, res) {
    try {
      const users = await Users.find();

      return Response.Success(res, {
        users,
      });
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching afrilearn users');
    }
  }
}
