import mongoose from 'mongoose';
import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';
import Term from '../db/models/terms.model';
import Response from '../utils/response.utils';

/**
 * Contains Terms controller
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

      Response.Success(res, { course: result }, 201);
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
    if (!mongoose.Types.ObjectId.isValid(termId)) { return Response.BadRequestError(res, 'termId is invalid'); }
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
    try {
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
      const terms = await Terms.find();

      return Response.Success(res, { terms });
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching terms');
    }
  }
}
