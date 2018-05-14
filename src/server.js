// do not change require order (config must be first)
var config = require('./config')
var app = require('./app')
var db = require('./db')
var logger = require('./logger')

var HTTP_HOST = config.get('http.host')
var HTTP_PORT = config.get('http.port')

var httpServer = null

function startHttpServer () {
  return new Promise(function (resolve, reject) {
    try {
      httpServer = app.listen(HTTP_PORT, HTTP_HOST, function () {
        logger.info('App listening on:', httpServer.address())
        logger.debug('process.env.NODE_ENV="%s"', process.env.NODE_ENV)
        logger.silly('config=%s', config.toString())
        resolve(httpServer)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function start () {
  return Promise.all([
    startHttpServer(),
    db.connect()
  ])
}

function stop () {
  return Promise.all([
    httpServer.close(),
    db.disconnect()
  ])
}

module.exports = {
  httpServer,
  start,
  stop
}
