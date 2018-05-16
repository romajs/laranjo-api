var blocked = require('blocked')
var bodyParser = require('body-parser')
var compression = require('compression')
var cors = require('cors')
var express = require('express')
var expressValidator = require('express-validator')
var expressWinston = require('express-winston')
var helmet = require('helmet')
var path = require('path')

var config = require('./config')
var logger = require('./logger')
var util = require('./util')

// blocked
blocked(function (ms) {
  logger.silly('blocked for %s ms', ms | 0)
})

// app
var app = express()

// static
var STATIC_DIR_PATH = path.resolve(`${__dirname}/../static`)
app.use(express.static(STATIC_DIR_PATH))

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

function routePath (path) {
  return `${config.get('http.rootBasePath')}/${path || ''}/`.replace(/\//g, '')
}

// route
app.use(routePath(`${config.get('googleHangoutsChat.basePath')}`), require('./route'))
app.use(routePath(`${config.get('admin.basePath')}`), require('./routeUpload'))

// error handling
app.use(function (err, req, res, next) {
  logger.error(err.stack)
  return next(err)
})

module.exports = app
