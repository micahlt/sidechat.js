/**
 * Throwable error caused by the Sidechat API
 * @class
 * @extends Error
 */
class SidechatAPIError extends Error {
  /**
   * HTTP status code of the failed response, if the error came from a non-2xx response
   * @type {Number|undefined}
   */
  status;

  /**
   * Parsed JSON body of the failed response, if any
   * @type {any}
   */
  response;

  /**
   * @param {String} message - human-readable description of the error
   * @param {Object} [details]
   * @param {Number} [details.status] - HTTP status code of the failed response
   * @param {any} [details.response] - parsed JSON body of the failed response
   * @param {Error} [details.cause] - underlying error, if this wraps one
   */
  constructor(message, details = {}) {
    super(message, details.cause ? { cause: details.cause } : undefined);
    this.name = "SidechatAPIError";
    this.status = details.status;
    this.response = details.response;
  }
}

export default SidechatAPIError;
