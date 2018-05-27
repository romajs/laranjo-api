var unleashClient = require('unleash-client')

var config = require('./config')
var logger = require('./logger')

var instance

function initialize () {
  try {
    instance = unleashClient.initialize({
      appName: 'laranjo-api',
      backupPath: '/tmp',
      url: config.get('unleash.url')
    })

    instance.on('error', logger.error)
    instance.on('warn', logger.warn)

    instance.on('ready', function () {
      logger.info('Unleash client is ready')
    })

    instance.on('registered', function (clientData) {
      logger.info('Registered', clientData)
    })

    instance.on('sent', function (payload) {
      logger.info('Metrics bucket/payload sent', payload)
    })

    instance.on('count', function (name, enabled) {
      logger.info(`isEnabled(${name}) returned ${enabled}`)
    })

    return Promise.resolve(instance)
  } catch (err) {
    return Promise.reject(err)
  }
}

function destroy () {
  return instance.destroy()
}

module.exports = {
  initialize,
  destroy
}
