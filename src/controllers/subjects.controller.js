import MainSubjects from '../db/models/mainSubjects.model';
import Response from '../utils/response.utils';

/**
 *Contains Subjects Controller
 *
 *
 * @class SubjectsController
 */
export default class SubjectsController {
  /**
   * @memberof SubjectsController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async fetchAllSubjects(req, res) {
    try {
      const result = await MainSubjects.find();

      return Response.Success(res, { subjects: result });
    } catch (err) {
      Response.InternalServerError(res, 'Could not fetch subjects', err);
    }
  }
}
