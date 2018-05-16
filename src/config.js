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
  admin: {
    auth: {
      enabled: {
        format: Boolean,
        default: false,
        env: 'ADMIN_AUTH_ENABLED',
        arg: 'admin-auth-enabled'
      },
      password: {
        format: String,
        default: '',
        env: 'ADMIN_AUTH_PASSWORD',
        arg: 'admin-auth-password'
      },
      username: {
        format: String,
        default: '',
        env: 'ADMIN_AUTH_USERNAME',
        arg: 'admin-auth-username'
      }
    },
    basePath: {
      format: String,
      default: '/',
      env: 'ADMIN_BASE_PATH',
      arg: 'admin-base-path'
    }
  },
  googleHangoutsChat: {
    auth: {
      enabled: {
        format: Boolean,
        default: false,
        env: 'GOOGLE_HANGOUTS_CHAT_AUTH_ENABLED',
        arg: 'google-hangouts-chat-auth-enabled'
      },
      token: {
        format: String,
        default: '',
        env: 'GOOGLE_HANGOUTS_CHAT_AUTH_TOKEN',
        arg: 'google-hangouts-chat-auth-token'
      }
    },
    basePath: {
      format: String,
      default: '/',
      env: 'GOOGLE_HANGOUTS_CHAT_BASE_PATH',
      arg: 'google-hangouts-chat-base-path'
    }
  },
  http: {
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
    },
    rootBasePath: {
      format: String,
      default: '/',
      env: 'ROOT_BASE_PATH',
      arg: 'root-base-path'
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
