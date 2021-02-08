import Response from "../utils/response.utils";
import { check, validationResult } from 'express-validator';
import HelperUtils from '../utils/helpers.utils';

/**
 * Contains Params Validations
 * 
 * @class ParamsValidator
 */
export default class ParamsValidator{
    /**
     * @returns {Array} Array of errors if mongooseID is invalid
     * @returns {EmptyArray} Empty array if mongooseID is valid
     * @param {*} param Name of expected mongoose id parameter
     */
    static validateMongooseId(param){
        return [
            check(param)
            .custom(HelperUtils.validateMongooseId()),
        ]
    }
  
    /**
   * @returns {JSON} JSON error object if req contains error
   * @returns {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
    static async mongooseIdValidationResult(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errArr = errors.array().map(({ msg }) => msg);
        return Response.InvalidDataRequest(res, errArr);
      }
      return next();
    }
}