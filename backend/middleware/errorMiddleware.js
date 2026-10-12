export const notFoundMiddleware = (
  req,
  res
) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode ||
    err.status ||
    500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Internal server error.",
    ...(process.env.NODE_ENV === "development"
      ? { stack: err.stack }
      : {}),
  });
};