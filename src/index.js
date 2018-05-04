#! /usr/bin/env node

var path = require('path')

global.INDEX_DIR = process.cwd()

global.rootRequire = function (name) {
  return require(path.dirname(__filename) + '/' + name)
}

function startServer () {
  var server = rootRequire('main/server')
  return server.start().then(function (servers) {
    return 'Server started successfully @ ' + servers[0]._connectionKey
  })
}

function stopServer () {
  var server = rootRequire('main/server')
  return server.stop().then(function (servers) {
    return 'Server stoped successfully @ ' + servers[0]._connectionKey
  })
}

module.exports = {
  'start-server': startServer,
  'stop-server': stopServer
}

require('make-runnable/custom')({
  printOutputFrame: false
})
