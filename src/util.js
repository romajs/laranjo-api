var mongoose = require('mongoose')
var winston = require('winston')

var config = require('./config')

function getDefaultLoggerOptions (level) {
  return {
    colorize: true,
    exitOnError: false,
    expressFormat: true,
    level: level || config.get('logger.level'),
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
