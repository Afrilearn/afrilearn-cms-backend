import Term from '../db/models/terms.model';
import Response from '../utils/response.utils';

/**
 * Contains Terms Controller
 *
 * @class TermsController
 */
export default class TermsController {
  /**
   * @memberof TermsController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.internalServerError} if error occurs
   */
  static async createTerm(req, res) {
    try {
      const result = await Term.create({ ...req.body });

      Response.Success(res, { term: result }, 201);
    } catch (err) {
      Response.InternalServerError(res, 'Error creating term');
    }
  }

  /**
   * @memberof TermsController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.internalServerError} if error occurs
   */
  static async editTerm(req, res) {
    const termId = req.params.id;
    try {
      const term = await Term.findOne({ _id: termId });
      if (!term) return Response.NotFoundError(res, 'term does not exist');
      const termValues = { $set: req.body };
      await Term.updateOne({ _id: termId }, termValues);
      return Response.Success(res, { message: 'term updated successfully' }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not update term');
    }
  }

  /**
   * @memberof TermssController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async deleteTerm(req, res) {
    const termId = req.params.id;
    try {
      const term = await Term.findOne({ _id: termId });
      if (!term) return Response.NotFoundError(res, 'term does not exist');
      await Term.deleteOne({ _id: req.params.id });
      Response.Success(res, { message: 'Term deleted successfully' });
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting term');
    }
  }

  /**
   * @memberof TermsController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async fetchAllTerms(req, res) {
    try {
      const terms = await Term.find();

      return Response.Success(res, { terms });
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching terms');
    }
  }
}
