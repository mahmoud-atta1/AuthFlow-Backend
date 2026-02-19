const globalError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  return res.status(statusCode).json({
    message: err.message,
    success: false,
    status: status,
    stack: err.stack,
    error: err,
  });
};

module.exports = globalError;
