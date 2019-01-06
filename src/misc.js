var mongoose = require('mongoose')
var winston = require('winston')

var config = require('./config')

const isObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId(id)
  } catch (err) {
    return false
  }
}

const expressValidator = {
  middlewareOptions: () => ({ customValidators: { isObjectId } })
}

const winstonLogger = {
  options: ({ level = config.get('logger.level') } = {}) => ({
    colorize: true,
    exitOnError: false,
    expressFormat: true,
    level: level,
    transports: [
      new winston.transports.Console({
        colorize: true,
        timestamp: true
      })
    ]
  })
}

module.exports = {
  expressValidator,
  winstonLogger
}
