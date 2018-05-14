var winston = require('winston')

var env = process.env.NODE_ENV

var config = {
  cloudinary: {
    upload_prefix: process.env.CLOUDINARY_UPLOAD_PREFIX
  },
  http: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8000,
    baseRoute: process.env.BASE_ROUTE || '/'
  },
  logger: {
    level: process.env.WINSTON_LOGGER_LEVEL || 'debug'
  },
  mongodb: {
    url: process.env.MONGODB_URI
  }
}

module.exports = config
