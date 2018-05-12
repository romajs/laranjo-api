// do not change require order (config must be first)
var config = require('./config')
var logger = require('./logger')
var app = require('./app')

var httpServer = null

function startHttpServer () {
  return new Promise(function (resolve, reject) {
    try {
      httpServer = app.listen(config.http.port, config.http.host, function () {
        logger.info('App listening on:', httpServer.address())
        logger.info('process.env.NODE_ENV="%s", env="%s"', process.env.NODE_ENV, config.name)
        resolve(httpServer)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function start () {
  return Promise.all([
    startHttpServer()
  ])
}

function stop () {
  return Promise.all([
    httpServer.close()
  ])
}

module.exports = {
  httpServer,
  start,
  stop
}
