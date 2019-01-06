const blocked = require('blocked')

/**
 * Warning! Do not change require order, config must be first.
 */
const config = require('./config')
const app = require('./app')
const db = require('./db')
const logger = require('./logger')

let httpServer = null
let timer = null

const startHttpServer = () => new Promise((resolve, reject) => {
  try {
    const [port, host] = [config.get('http.port'), config.get('http.host')]
    httpServer = app.listen(port, host, () => {
      logger.info('App listening on:', httpServer.address())
      logger.debug('process.env.NODE_ENV="%s"', process.env.NODE_ENV)
      logger.silly('config=%s', config.toString())
      resolve(httpServer)
    })
  } catch (err) {
    reject(err)
  }
})

const startTimer = () => {
  timer = blocked((ms) => logger.silly('blocked for %s ms', ms | 0))
}

const stopTimer = () => clearInterval(timer)

const start = () => Promise.all([
  startTimer(),
  startHttpServer(),
  db.connect()
])

const stop = () => Promise.all([
  stopTimer(),
  httpServer.close(),
  db.disconnect()
])

module.exports = {
  httpServer,
  start,
  stop
}
