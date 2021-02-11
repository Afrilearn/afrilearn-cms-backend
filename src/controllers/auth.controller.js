import CmsUser from '../db/models/cmsUsers.model';
import Helper from '../utils/user.utils';
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

      const encryptpassword = await Helper.encryptPassword(password);

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
      return Response.InternalServerError(res, 'Error signing up user');
    }
  }

  /**
   * Handles signIn requests
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async signIn(req, res) {
    const signinError = { message: 'Incorrect email or password' };
    try {
      const user = await CmsUser.findOne({ email: req.body.email });
      if (!user) return Response.UnauthorizedError(res, signinError);
      const confirmPassword = await Helper.validateUserPassword(
        user,
        req.body.password,
      );
      if (!confirmPassword) return Response.UnauthorizedError(res, signinError);
      const token = Helper.generateToken(
        user._id,
        user.role,
        user.firstName,
      );
      Helper.setCookie(res, token);
      const data = { token, user };
      return Response.Success(res, data);
    } catch (err) {
      return Response.InternalServerError(res, 'Error Logging in User');
    }
  }
}
