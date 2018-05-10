var routeEventHandlers = {
  'ADDED_TO_SPACE': AddedToSpadeRouteEventHandler,
  'MESSAGE': MessageRouteEventHandler
}

function AddedToSpadeRouteEventHandler () {
  this.validate = function (req) {
  }

  this.buildResponse = function (req, res, next) {
    var text = 'VO TI DA U SHUTI'
    return res.json({
      'text': text
    })
  }
}

function MessageRouteEventHandler () {
  this.validate = function (req) {
    req.checkBody('space.name', 'required').notEmpty()
    req.checkBody('message.text', 'required').notEmpty()
    req.checkBody('message.thread.name', 'required').notEmpty()
  }

  this.buildResponse = function (req, res, next) {
    var msg = req.body.message.text

    return res.json({
      'cards': [{
        'sections': [{
          'widgets': [{
            'image': {
              'imageUrl': req.urlOrigin + this.fetchImage(msg)
            }
          }]
        }]
      }]
    })
  }

  this.fetchImage = function (msg) {
    if (msg === 'gas') {
      return `/img/o-o-gas.jpg`
    }

    return `/img/vo-ti-da-u-shuti.jpg`
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
