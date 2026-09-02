export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  if (err.name === 'CastError') {
    error.message = 'Resource not found'
    error.statusCode = 404
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    error.message = `${field} already exists`
    error.statusCode = 409
  }

  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((val) => val.message).join(', ')
    error.statusCode = 422
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : null,
  })
}
