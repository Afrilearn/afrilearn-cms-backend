/**
 * Defines reusable responses
 */
export default class {
  /**
     * Defines the specification for the "unauthorized error" response cases
     * @param {Object} res
     * @param {Object} error
     * @param {number} code
     * @returns {Object} response
     */
  static UnauthorizedError(res, error, code) {
    return res.status(code || 401).json({
      status: 'error',
      error,
    });
  }

  /**
     * Defines the specification for the "success" response cases
     * @param {Object} res
     * @param {Object} data
     * @param {number} code
     * @returns {ServerResponse} response
     */
  static Success(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data,
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
     * @param {Object} res
     * @param {Object|string} error
     * @returns {Object} response
     */
  static InternalServerError(res, error) {
    return res.status(500).json({
      status: 'error',
      error,
    });
  }
}
