const makeRunnable = require('make-runnable/custom')

const server = require('./server')

const startServer = () => server.start().then((servers) => {
  return `Server started successfully @ ${servers[1]._connectionKey}`
})

const stopServer = () => server.stop().then((servers) => {
  return `Server stoped successfully @ ${servers[1]._connectionKey}`
})

module.exports = {
  'start-server': startServer,
  'stop-server': stopServer
}

// makeRunnable must be called after module.exports
makeRunnable({ printOutputFrame: false })
