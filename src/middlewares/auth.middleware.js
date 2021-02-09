import jwt from 'jsonwebtoken';
import CmsUser from '../db/models/cmsUsers.model';
import Response from '../utils/response.utils';

const auth = {
  verifyToken(token) {
    let decoded = {};
    try {
      decoded.payload = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      decoded = { error: error.message };
    }
    return decoded;
  },

  async verifyUserToken(req, res, next) {
    try {
      let token = req.headers.token
        || req.body.token
        || req.headers.authorization
        || req.body.authorization
        || req.headers['x-access-token'];

      if (!token) { return Response.UnauthorizedError(res, 'No token provided!'); }

      if (token.startsWith('Bearer')) token = token.slice(7);
      const decoded = auth.verifyToken(token);

      if (decoded.error) { return Response.UnauthorizedError(res, 'Invalid authentication token.'); }

      const user = await CmsUser.findOne({ id: decoded.payload._id });
      if (!user) return Response.UnauthorizedError(res, 'Failed to authenticate token', 401);
      req.currentUser = user;
      const { payload } = decoded;
      req.body.user = user;
      req.tokenData = payload;
      return next();
    } catch (error) {
      return Response.InternalServerError(res, 'Internal Server Error.');
    }
  },

  async verifyManager(req, res, next) {
    try {
      if (!((req.tokenData.role === 'moderator') || (req.tokenData.role === 'admin'))) { return Response.UnauthorizedError(res, 'You are not permitted to perform this action'); }
      return next();
    } catch (error) {
      return Response.InternalServerError(res, 'Error Accessing Route');
    }
  },

};

export default auth;
