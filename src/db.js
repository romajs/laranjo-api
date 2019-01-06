const mongoose = require('mongoose')

const config = require('./config')
const logger = require('./logger')

let client = null

const connect = () => new Promise(function (resolve, reject) {
  client = mongoose.connect(config.get('mongodb.uri'))

  mongoose.connection.on('error', function (err) {
    logger.error(err)
    reject(err)
  })

  mongoose.connection.once('open', function () {
    logger.info('MongoDB/mongoose connected successfully')
    resolve(mongoose.connection)
  })
})

const disconnect = () => client.disconnect()

mongoose.Promise = global.Promise

module.exports = {
  connect,
  connection: mongoose.connection,
  disconnect
}
