var logger = require('./logger')
var model = require('./model')

var routeEventHandlers = {
  'ADDED_TO_SPACE': AddedToSpadeRouteEventHandler,
  'MESSAGE': MessageRouteEventHandler
}

function AddedToSpadeRouteEventHandler () {
  this.buildResponse = function (req, res, next) {
    var text = 'VO TI DA U SHUTI'
    return res.json({
      'text': text
    })
  }
}

function MessageRouteEventHandler () {
  this.validate = function (req) {
    req.checkBody('message.argumentText', 'required').notEmpty()
  }

  this.buildResponse = function (req, res, next) {
    var text = req.body.message.argumentText.trim()

    var query = {
      'tags': {
        $in: text.split(' ')
      }
    }

    return model.Attachment.findOne(query).then(function (attachment) {
      if (attachment === null) {
        logger.debug('Query="%j". No attachment found.', query)
        return res.status(404).end()
      } else {
        logger.debug('Query="%j". Found attachment="%j"', query, attachment)
        return res.json({
          'cards': [{
            'sections': [{
              'widgets': [{
                'image': {
                  'imageUrl': attachment.url
                }
              }]
            }]
          }]
        })
      }
    }).catch(function (err) {
      return next(err)
    })
  }
}

function routeEventHandler (type) {
  var RouteEventHandler = routeEventHandlers[type]
  if (RouteEventHandler === undefined) {
    throw new Error(`No RouteEventHandler found for ${type}`)
  }
  var instance = new RouteEventHandler()
  logger.debug(`Found handler=${instance.constructor.name} for type=${type}`)
  return instance
}

module.exports = routeEventHandler
