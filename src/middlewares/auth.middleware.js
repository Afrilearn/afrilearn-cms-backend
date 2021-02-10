import jwt from 'jsonwebtoken';
import Response from '../utils/response.utils';

/**
 *Contains Auth Middlewares
 *
 *
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * @memberof AuthMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if no token provided or token is invalid
   * @returns {JSON} passes control to the next function
   */
  static validateToken(req, res, next) {
    const { token: headerToken = null } = req.headers;
    const { token: queryToken = null } = req.query;

    const token = queryToken || headerToken;

    if (!token) {
      return Response.UnauthorizedError(res, 'Not authorized to access data');
    }
    jwt.verify(token, process.env.SECRET, (error, result) => {
      if (error) {
        return Response.UnauthorizedError(res, 'Not authorized to access data');
      }
      req.data = result.data;
      return next();
    });
  }

  /**
   * @memberof AuthMiddleware
   * @param {*} role - The minimum level permitted to access  data
   * @returns {JSON} Error response if user is not up to level
   * @returns {JSON} passes control to the next function
   */
  static grantAccess(role = '602209d72792e63fc841de3e') {
    const roles = [
      '602209ab2792e63fc841de3c',
      '602209c32792e63fc841de3d',
      '602209d72792e63fc841de3e',
    ];
    const roleIndex = roles.findIndex((val) => val === role);
    return (req, res, next) => {
      if (
        roleIndex < 0
        || roles.findIndex((val) => val === req.data.role) < roleIndex
      ) {
        return Response.UnauthorizedError(res, 'Not authorized to access data');
      }
      return next();
    };
  }
}

export default AuthMiddleware;
