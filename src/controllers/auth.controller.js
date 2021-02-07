import CmsUser from '../db/models/cmsUsers.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';

/**
 * Contains AuthController
 *
 * @class AuthController
 */
export default class AuthController {
  /**
   *
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async signup(req, res) {
    try {
      const {
        firstName, lastName, password, email, role,
      } = req.body;

      const encryptpassword = await userUtils.encryptPassword(password);

      const newUser = {
        firstName,
        lastName,
        password: encryptpassword,
        email,
        role,
      };

      const result = await CmsUser.create({ ...newUser });

      return Response.Success(res, { user: result }, 201);
    } catch (err) {
      return Response.InternalServerError(res, 'Could not signup user', err);
    }
  }
}
