import { NODE_ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  if (NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Resource not found with id of ${err.value}`;
    res.status(404);
  }

  // Mongoose duplicate key (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate field value entered: ${field}. Please use another value.`;
    res.status(400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((val) => val.message).join(', ');
    res.status(400);
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: NODE_ENV === 'development' ? err.stack : null,
  });
};
