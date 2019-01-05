var makeRunnable = require('make-runnable/custom')

var server = require('./server')

makeRunnable({ printOutputFrame: false })

function startServer () {
  return server.start().then(function (servers) {
    return 'Server started successfully @ ' + servers[0]._connectionKey
  })
}

function stopServer () {
  return server.stop().then(function (servers) {
    return 'Server stoped successfully @ ' + servers[0]._connectionKey
  })
}

module.exports = {
  'start-server': startServer,
  'stop-server': stopServer
}
