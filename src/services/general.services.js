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
      return Response.NotFound(res, `${name} does not exist`);
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
      return Response.ConflictingRequest(res, `${name} already exists`);
    }
    return next();
  }
}
