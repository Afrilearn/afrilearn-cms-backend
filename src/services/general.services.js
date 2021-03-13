import s3Storage from 'multer-s3';
import Response from '../utils/response.utils';

/**
 * Contains General Services
 *
 *
 * @class GeneralServices
 */
export default class GeneralServices {
  /**
   * @returns {JSON} - returns json error object if document doesn't exist
   * @returns {Function} - passes control to the next function
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @param {*} Collection - db Collection to query
   * @param {*} condition - search condition
   * @param {*} name - name of document
   */
  static async checkDocExistence(
    req,
    res,
    next,
    Collection,
    condition,
    name,
  ) {
    const result = await Collection.findOne(condition);
    if (!result) {
      return Response.NotFoundError(res, `${name} does not exist`);
    }
    req.dbResult = result;
    return next();
  }

  /**
   * @returns {JSON} - returns json error object if document exists
   * @returns {Function} - passes control to the next function
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @param {*} Collection - db Collection to query
   * @param {*} condition - search condition
   * @param {*} name - name of document
   */
  static async checkDocInexistence(
    res,
    next,
    Collection,
    condition,
    name,
  ) {
    const result = await Collection.findOne(condition);
    if (result) {
      return Response.ConflictError(res, `${name} already exists`);
    }
    return next();
  }
}

// let deletes = [];
// for(let i = 0; i < 5; i++){
//   let params = {
//     bucket: "...",
//     key: "..."
//   }
//   deletes.push(params);
// }

// await s3Storage.deleteObjects(params).promi;