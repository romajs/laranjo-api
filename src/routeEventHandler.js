const logger = require('./logger')
const model = require('./model')

class AddedToSpadeRouteEventHandler {
  buildResponse (req, res, next) {
    const text = 'VO TI DA U SHUTI'
    return res.json({
      'text': text
    })
  }
}

class MessageRouteEventHandler {
  validate (req) {
    req.checkBody('message.argumentText', 'required').notEmpty()
  }

  buildResponse (req, res, next) {
    const text = req.body.message.argumentText.trim()

    const query = {
      'tags': {
        $in: text.split(' ')
      }
    }

    return model.Attachment.findOne(query).then((attachment) => {
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
    }).catch((err) => {
      return next(err)
    })
  }
}

const routeEventHandlers = {
  'ADDED_TO_SPACE': AddedToSpadeRouteEventHandler,
  'MESSAGE': MessageRouteEventHandler
}

const routeEventHandler = (type) => {
  const RouteEventHandler = routeEventHandlers[type]
  if (RouteEventHandler === undefined) {
    throw new Error(`No RouteEventHandler found for ${type}`)
  }
  const instance = new RouteEventHandler()
  logger.debug(`Found handler=${instance.constructor.name} for type=${type}`)
  return instance
}

module.exports = routeEventHandler
