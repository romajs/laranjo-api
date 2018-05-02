var config = rootRequire('config')
var winston = require('winston')

var logger = new (winston.Logger)(config.logger)

module.exports = logger
