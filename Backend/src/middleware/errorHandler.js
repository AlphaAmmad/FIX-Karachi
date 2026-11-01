const ApiError = require('../utils/ApiError');

const notFound = (_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || null,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};