/**
 * Contains Responses
 *
 * @class Response
 */
export default class Response {
    /**
     * @returns {JSON} - JSON error object with 500 status
     * @param {*} res - Response Object
     * @param {*} message - error message
     * @param {*} err - thrown error
     */
    static InternalServerError(res, message, err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: message,
        errors: err || [message],
      });
    }
  
    /**
     * @returns {JSON} - JSON error object with 400 status
     * @param {*} res - Response Object
     * @param {*} errs - thrown errors
     * @param {*} message - error message
     */
    static InvalidDataRequest(
      res,
      errs,
      message = 'Request contains invalid data',
    ) {
      return res.status(400).json({
        status: '400 Invalid Request',
        error: message,
        errors: errs,
      });
    }
  
    /**
     * @returns {JSON} - JSON error object with status 401
     * @param {*} res - Response Object
     * @param {*} message - error message
     */
    static Unauthorised(res, message = 'Not authorized to access data') {
      return res.status(401).json({
        status: '401 Unauthorized',
        error: message,
      });
    }
  
    /**
     * @returns {JSON} - JSON error object with status 400
     * @param {*} res - Response Object
     * @param {*} message - error message
     */
    static BadRequest(res, message = 'Bad request') {
      return res.status(400).json({
        status: '400 Bad Request',
        error: message,
      });
    }
  
    /**
     * @returns {JSON} - JSON error object with status 409
     * @param {*} res - Response Object
     * @param {*} message - error message
     */
    static ConflictingRequest(
      res,
      message = 'Submitted data conflicts with existing data',
    ) {
      return res.status(409).json({
        status: '409 Conflicting Request',
        error: message,
      });
    }
  
    /**
     * @returns {JSON} - JSON error object with status 404
     * @param {*} res - Response Object
     * @param {*} message - error message
     */
    static NotFound(res, message = 'Requested data was not found') {
      return res.status(404).json({
        status: '404 Not Found',
        error: message,
      });
    }
  
    /**
     * @returns {JSON} - JSON success object
     * @param {*} res - Response Object
     * @param {*} data - data to send back on success
     * @param {*} status - res status, 200 by default
     */
    static Success(res, data, status = 200) {
      return res.status(status).json({
        status: 'Success',
        data,
      });
    }
  }
  