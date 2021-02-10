import { check, validationResult } from 'express-validator';

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
        .isAlphanumeric()
        .withMessage('Subject Name should be a valid name'),
      // check('introText')
      //   .isAlphanumeric()
      //   .withMessage('introText is invalid'),
      // check('classification')
      //   .isAlphanumeric()
      //   .withMessage('classification is invalid'),
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
      return res.status(400).json({
        status: '400 Invalid Request',
        error: 'Your request contains invalid parameters',
        errors: errArr,
      });
    }
    return next();
  }
}
export default AddMajorSubject;
