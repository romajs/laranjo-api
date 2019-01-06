const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const expressValidator = require('express-validator')
const expressWinston = require('express-winston')
const helmet = require('helmet')

const config = require('./config')
const logger = require('./logger')
const misc = require('./misc')

const app = express()

/**
 * Middlewares
 */
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator(misc.expressValidator.middlewareOptions()))
app.use(expressWinston.logger(misc.winstonLogger.options({ level: 'info' })))

const routePath = (path) => {
  const routePath = `${config.get('http.rootBasePath')}/${path}`.replace(/\/+/g, '/')
  logger.debug(`Registering route at ${routePath}`)
  return routePath
}

/**
 * Routes
 */
app.use(routePath(`${config.get('googleHangoutsChat.basePath')}`), require('./route'))
app.use(routePath(`${config.get('admin.basePath')}`), require('./routeUpload'))

/**
 * Error handling
 */
app.use(function (err, req, res, next) {
  logger.error(err.stack)
  return next(err)
})

module.exports = app
