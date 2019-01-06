const { Logger } = require('winston')

const misc = require('./misc')

const logger = new Logger(misc.winstonLogger.options())

module.exports = logger
