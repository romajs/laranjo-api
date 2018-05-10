var winston = require('winston')

var config = require('./config')

var logger = new (winston.Logger)(config.logger)

module.exports = logger
