// do not change require order (config must be first)
var config = rootRequire('config')
var logger = rootRequire('logger')
var app = rootRequire('app')

var httpServer = null

function startHttpServer () {
  return new Promise(function (resolve, reject) {
    try {
      httpServer = app.listen(config.http.port, config.http.host, function () {
        logger.info('App listening on:', httpServer.address())
        logger.info('INDEX_DIR="%s", env="%s"', global.INDEX_DIR, config.name)
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
