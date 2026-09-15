export default SidechatAPIError;
/**
 * Throwable error caused by the Sidechat API
 * @class
 * @extends Error
 */
declare class SidechatAPIError extends Error {
    /**
     * @param {String} message - human-readable description of the error
     * @param {Object} [details]
     * @param {Number} [details.status] - HTTP status code of the failed response
     * @param {any} [details.response] - parsed JSON body of the failed response
     * @param {Error} [details.cause] - underlying error, if this wraps one
     */
    constructor(message: string, details?: {
        status?: number;
        response?: any;
        cause?: Error;
    });
    /**
     * HTTP status code of the failed response, if the error came from a non-2xx response
     * @type {Number|undefined}
     */
    status: number | undefined;
    /**
     * Parsed JSON body of the failed response, if any
     * @type {any}
     */
    response: any;
}
//# sourceMappingURL=SidechatAPIError.d.ts.map