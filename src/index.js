#! /usr/bin/env node

var path = require('path')

global.rootPath = function (name) {
  return (path.dirname(__filename) + '/' + name).replace('//', '/')
}

global.rootRequire = function (name) {
  return require(rootPath(name))
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
