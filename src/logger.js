var winston = require('winston')

var config = require('./config')
var util = require('./util')

var loggerOptions = util.getDefaultLoggerOptions()
var logger = new (winston.Logger)(loggerOptions)

module.exports = logger
