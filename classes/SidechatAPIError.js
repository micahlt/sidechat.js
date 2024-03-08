class SidechatAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "SidechatAPIError";
  }
}

export default SidechatAPIError;
