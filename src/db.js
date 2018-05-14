var mongoose = require('mongoose')

var config = require('./config')
var logger = require('./logger')

var MONGODB_URI = config.get('mongodb.uri')

var client = null

function connect () {
  return new Promise(function (resolve, reject) {
    client = mongoose.connect(MONGODB_URI)
    mongoose.connection.on('error', function (err) {
      logger.error(err)
      reject(err)
    })
    mongoose.connection.once('open', function () {
      logger.info('MongoDB/mongoose connected successfully')
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
