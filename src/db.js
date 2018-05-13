var mongoose = require('mongoose')

var config = require('./config')
var logger = require('./logger')

var client = null

function connect () {
  var url = config.mongodb.url
  return new Promise(function (resolve, reject) {
    client = mongoose.connect(url)
    mongoose.connection.on('error', function (err) {
      logger.error(err)
      reject(err)
    })
    mongoose.connection.once('open', function () {
      logger.info('MongoDB/mongoose connected successfully at: %s', url)
      resolve(mongoose.connection)
    })
  })
}

function disconnect () {
  return client.disconnect()
}

mongoose.Promise = global.Promise

module.exports = {
  connect,
  connection: mongoose.connection,
  disconnect
}
