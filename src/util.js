var mongoose = require('mongoose')
var winston = require('winston')

var config = require('./config')

var LOGGER_LEVEL = config.get('logger.level')

function getDefaultLoggerOptions (level) {
  return {
    colorize: true,
    exitOnError: false,
    expressFormat: true,
    level: level || LOGGER_LEVEL,
    transports: [
      new winston.transports.Console({
        colorize: true,
        timestamp: true
      })
    ]
  }
}

function isObjectId (id) {
  try {
    return mongoose.Types.ObjectId(id)
  } catch (err) {
    return false
  }
}

module.exports = {
  getDefaultLoggerOptions,
  isObjectId
}
