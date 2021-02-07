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
      return Response.Unauthorised(res);
    }
    jwt.verify(token, process.env.SECRET, (error, result) => {
      if (error) {
        return Response.Unauthorised(res);
      }
      req.body.accessRole = result.data.role;
      return next();
    });
  }

  /**
   * @memberof AuthMiddleware
   * @param {*} level - The minimum level permitted to access  data
   * @returns {JSON} Error response if user is not up to level
   * @returns {JSON} passes control to the next function
   */
  static grantAccess(level = 'Administrator') {
    const levels = ['Staff', 'Moderator', 'Administrator'];
    const levelIndex = levels.findIndex((val) => val === level);
    const allowedLevels = levels.slice(levelIndex);
    return (req, res, next) => {
      if (
        levels.findIndex((val) => val === req.body.accessRole.name) < levelIndex
      ) {
        return res.status(403).json({
          status: '403 Forbidden',
          error: `${allowedLevels.join(' or ')} access only`,
        });
      }
      return next();
    };
  }
}

export default AuthMiddleware;
