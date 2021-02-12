import { check, validationResult } from 'express-validator';
import Response from '../utils/response.utils';

/**
 *Contains Major Subject Validator
 *
 *
 *
 * @class AddMajorSubject
 */
class AddMajorSubject {
  /**
     * validate data.
     * @memberof AddMajorSubject
     * @returns {null} - No response.
     */
  static validateData() {
    return [
      check('name')
        .exists()
        .withMessage('Subject Name is required')
        .not()
        .isEmpty()
        .withMessage('Subject Name cannot be empty')
        .isString()
        .withMessage('Subject Name should be a valid name'),
    ];
  }

  /**
   * Validate major subject.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof Login
   * @returns {JSON} - A JSON success response.
   */
  static async myValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}

export default AddMajorSubject;
