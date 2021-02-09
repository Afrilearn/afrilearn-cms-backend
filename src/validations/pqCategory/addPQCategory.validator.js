import { check, validationResult } from 'express-validator';

/**
 *Contains PQCtegory Validator
 *
 *
 *
 * @class PQCategory
 */
class AddPQCategory {
  /**
     * validate data.
     * @memberof AddPQCategory
     * @returns {null} - No response.
     */
  static validateData() {
    return [
      check('name')
        .exists()
        .withMessage('Category Name is required')
        .not()
        .isEmpty()
        .withMessage('Category Name cannot be empty')
        .isAlphanumeric()
        .withMessage('Category Name should be a valid name'),
      check('categoryId')
        .exists()
        .withMessage('CategoryId is required')
        .not()
        .isEmpty()
        .withMessage('CategoryId cannot be empty')
        .isNumeric()
<<<<<<< HEAD
        .withMessage('CategoryId is invalid'),
=======
        .withMessage('CategoryId is invalid')
>>>>>>> 5ddb91ff21f56c9691cbbf15a79de902b440736f
    ];
  }

  /**
   * Validate past question category.
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
export default AddPQCategory;
