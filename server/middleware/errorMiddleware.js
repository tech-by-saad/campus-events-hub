
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.code === 11000) {
    statusCode = 409;
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error"
  });
};
