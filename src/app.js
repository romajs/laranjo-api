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
var util = require('./util')

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
app.use(expressValidator({
  customValidators: {
    isObjectId: util.isObjectId
  }
}))

// express winston logger
var loggerOptions = util.getDefaultLoggerOptions('info')
app.use(expressWinston.logger(loggerOptions))

app.use(function (req, res, next) {
  req.urlOrigin = url.format({
    protocol: req.protocol,
    host: req.get('host')
  })
  next()
})

// route
var BASE_ROUTE = config.get('http.baseRoute')
app.use(BASE_ROUTE, [
  require('./route'),
  require('./routeUpload')
])

// error handling
app.use(function (err, req, res, next) {
  logger.error(err.stack)
  return next(err)
})

module.exports = app
