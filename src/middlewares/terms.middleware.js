import Term from '../db/models/terms.model';
import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';
import Subjects from '../db/models/subjects.model';
import GeneralServices from '../services/general.services';

/**
 * Contains Term Middleware
 *
 * @class TermMiddleware
 */
export default class TermMiddleware {
  /**
   * @memberof TermMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if term doesn't exist
   * @returns {JSON} passes control to the next function if term exists
   */
  static async checkTermExists(req, res, next) {
    GeneralServices.checkDocInexistence(
      req,
      res,
      next,
      Term,
      { _id: req.params.id },
      'Term',
    );
  }
}
