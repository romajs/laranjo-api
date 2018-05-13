var blocked = require('blocked')
var bodyParser = require('body-parser')
var compression = require('compression')
var cors = require('cors')
var express = require('express')
var expressValidator = require('express-validator')
var expressWinston = require('express-winston')
var helmet = require('helmet')
var url = require('url')
var path = require('path')

var config = require('./config')
var logger = require('./logger')

// blocked
blocked(function (ms) {
  logger.warn('blocked for %sms', ms | 0)
})

// app
var app = express()

// static
app.use(express.static(function () {
  var staticDirPath = path.resolve(`${__dirname}/../static`)
  logger.debug('staticDirPath:', staticDirPath)
  return staticDirPath
}()))

// cors
app.use(cors())

// helmet
app.use(helmet())

// compression
app.use(compression())

// body parser / x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// body parse / json
app.use(bodyParser.json())

// custom express validatos
app.use(expressValidator())

// express winston logger
app.use(expressWinston.logger(function () {
  // always info, otherwise it wont work
  var configLogger = config.logger
  configLogger.level = 'info'
  return configLogger
}()))

app.use(function (req, res, next) {
  req.urlOrigin = url.format({
    protocol: req.protocol,
    host: req.get('host')
  })
  next()
})

// route
app.use(config.http.baseRoute, [
  require('./route')
])

// error handling
app.use(function (err, req, res, next) {
  logger.error(err.stack)
  return res.status(500).send({
    status: 500,
    message: 'Internal error',
    type: 'internal_error'
  }) || next()
})

module.exports = app
