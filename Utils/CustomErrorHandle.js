class CustomErrorHandle extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status =
      statusCode > 399 && statusCode < 499
        ? "client side error occur"
        : " server side error";
    this.optionError = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomErrorHandle;
