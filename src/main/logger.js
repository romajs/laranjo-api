var winston = require('winston')

var config = rootRequire('main/config')

var logger = new (winston.Logger)(config.logger)

module.exports = logger
