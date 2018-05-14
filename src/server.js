// do not change require order (config must be first)
var config = require('./config')
var app = require('./app')
var db = require('./db')
var logger = require('./logger')

var httpServer = null

function startHttpServer () {
  return new Promise(function (resolve, reject) {
    try {
      httpServer = app.listen(config.http.port, config.http.host, function () {
        logger.info('App listening on:', httpServer.address())
        logger.info('process.env.NODE_ENV="%s"', process.env.NODE_ENV)
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
