var routeEventHandlers = {
  'MESSAGE': MessageRouteEventHandler
}

function MessageRouteEventHandler () {

  this.validate = function(req) {
    req.checkBody('text', 'required').notEmpty()
    req.checkBody('space.name', 'required').notEmpty()
    req.checkBody('message.thread.name', 'required').notEmpty()
  }
  
  this.buildResponse = function(req, res, next) {
    var text = 'VO TI DA U SHUTI'
    var spaceId = req.body.space.name
    var threadId = req.body.message.thread.name
    return res.json({
      'text': text,
      'thread': {
         'name': `spaces/${spaceId}/threads/${threadId}`
      }
    })
  }

}

function routeEventHandler (type) {
  var routeEventHandler = routeEventHandlers[type]
  if (routeEventHandler === undefined) {
    throw new Error(`No routeEventHandler found for ${type}`)
  }
  return new routeEventHandler()
}

module.exports = routeEventHandler