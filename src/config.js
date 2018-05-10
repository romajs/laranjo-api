var winston = require('winston')

function baseConfig (name) {
  return {
    name: name || 'default',
    auth: {
      header_name: 'x-access-token',
      secret: 'JHVwM3JfJDNjcjM3Cg==',
      expiresIn: 86400 // expires in 24 hours
    },
    http: {
      host: '127.0.0.1',
      port: 8000
    },
    logger: {
      transports: [
        new winston.transports.Console({
          colorize: true,
          timestamp: true
        })
      ],
      level: 'silly',
      exitOnError: false,
      expressFormat: true,
      colorize: true
    }
  }
}

var profiles = {
  'dev': function (config) {
    config.http.host = '0.0.0.0'
    config.http.port = 8000
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  },
  'production': function (config) {
    config.http.host = '0.0.0.0'
    config.http.port = process.env.PORT
  }
}

var env = process.env.NODE_ENV || 'dev'

var config = baseConfig(env)
var profile = profiles[env]

profile(config)

module.exports = config
