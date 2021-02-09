import CmsUser from '../db/models/cmsUsers.model';
import Helper from '../utils/user.utils';
import Response from '../utils/response.utils';

/**
 *Contains Auth Controller
 *
 *
 *
 * @class AuthController
 */
class AuthController {
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
      const confirmPassword = await Helper.validateUserPassword(user, req.body.password);
      if (!confirmPassword) return Response.UnauthorizedError(res, signinError);
      const token = Helper.generateToken({ id: user._id, role: user.role, firstName: user.firstName});
      Helper.setCookie(res, token);
      const data = { token, user };
      return Response.Success(res, data);
    } catch (err) {
      return Response.InternalServerError(res, 'Error Logging in User');
    }
  }
}
export default AuthController;
