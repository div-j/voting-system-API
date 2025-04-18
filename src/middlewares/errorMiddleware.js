const { logger } = require("../utils/logger"); // Ensure correct destructuring

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log error
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (err.code === 'ECONNREFUSED') {
    logger.error("Network error: Unable to connect to the database");
    return res.status(503).json({
      success: false,
      error: { message: "Service unavailable. Please try again later." },
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = { errorHandler };

