var convict = require('convict')

var config = convict({
  env: {
    format: ['production', 'development', 'test'],
    env: 'NODE_ENV'
  },
  cloudinary: {
    upload_prefix: {
      format: '*',
      default: null,
      env: 'CLOUDINARY_UPLOAD_PREFIX',
      arg: 'cloudinary-upload-prefix'
    },
    url: {
      format: '*',
      default: null,
      env: 'CLOUDINARY_URL',
      arg: 'cloudinary-url',
      sensitive: true
    }
  },
  http: {
    baseRoute: {
      format: String,
      default: '/',
      env: 'BASE_ROUTE',
      arg: 'base-route'
    },
    host: {
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'HOST',
      arg: 'host'
    },
    port: {
      format: 'port',
      default: 8000,
      env: 'PORT',
      arg: 'port'
    }
  },
  logger: {
    level: {
      format: String,
      default: 'debug',
      env: 'LOGGER_LEVEL',
      arg: 'logger-level'
    }
  },
  mongodb: {
    uri: {
      format: '*',
      default: null,
      env: 'MONGODB_URI',
      arg: 'mongodb-url',
      sensitive: true
    }
  }
})

config.validate({allowed: 'strict'})

module.exports = config
