class ValidateError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = 200;
  }
}

module.exports = {
  ValidateError,
};
