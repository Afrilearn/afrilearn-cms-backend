import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Defines helper functions for the user model
 */
export default class UserUtils {
  /**
   * Generates a new token for a particular user
   * @param {string} id
   * @param {string} role
   * @param {string} firstName
   * @param {string} lastName
   * @returns {string} token
   */
<<<<<<< HEAD
  static generateToken({ id, role, firstName }) {
    return jwt.sign({
      id, role, firstName,
=======
  static generateToken({id, role, firstName}) {
    return jwt.sign({
      id, role, firstName
>>>>>>> 5ddb91ff21f56c9691cbbf15a79de902b440736f
    },
    process.env.SECRET, { expiresIn: '30d' });
  }

  /**
   * @param {object} user
   * @param {string} password
   * @returns {Promise} that resolves password validation
   */
  static validateUserPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  /**
   * Set cookie on response header
   * @param {ServerResponse} res
   * @param {string} userToken
   * @returns {undefined}
   */
  static setCookie(res, userToken) {
    res.cookie('token', userToken, {
      expires: new Date(Date.now() + (604800 * 1000)),
      httpOnly: true,
      secure: true,
    });
  }
}
