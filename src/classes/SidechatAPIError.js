/**
 * Throwable error caused by the Sidechat API
 * @class
 * @extends Error
 */
class SidechatAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "SidechatAPIError";
  }
}

export default SidechatAPIError;
