var routeEventHandlers = {
  'MESSAGE': MessageRouteEventHandler
}

function MessageRouteEventHandler () {
  this.validate = function (req) {
    req.checkBody('space.name', 'required').notEmpty()
    req.checkBody('message.text', 'required').notEmpty()
    req.checkBody('message.thread.name', 'required').notEmpty()
  }

  this.buildResponse = function (req, res, next) {
    var text = 'VO TI DA U SHUTI' // FIXME
    var threadName = req.body.message.thread.name
    return res.json({
      'text': text,
      'thread': {
        'name': `${threadName}`
      }
    })
  }
}

function routeEventHandler (type) {
  var RouteEventHandler = routeEventHandlers[type]
  if (RouteEventHandler === undefined) {
    throw new Error(`No RouteEventHandler found for ${type}`)
  }
  return new RouteEventHandler()
}

module.exports = routeEventHandler
