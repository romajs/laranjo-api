var express = require('express')
var router = express.Router()

var logger = require('./logger')
var routeEventHandler = require('./routeEventHandler')

var config = require('./config')

router.get('/', function (req, res, next) {
  res.end('VO TI DA U SHUTI')
})

router.post('/', function (req, res, next) {
  logger.silly('Request body:', req.body)

  req.checkBody('type', 'required').notEmpty()

  var AUTH_ENABLED = config.get('googleHangoutsChat.auth.enabled')

  if (AUTH_ENABLED) {
    req.checkBody('token', 'required').notEmpty()
  }

  return req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(function () {
    if (AUTH_ENABLED && req.body.token !== config.get('googleHangoutsChat.auth.token')) {
      return res.status(401).end()
    }

    var type = req.body.type
    var handler = routeEventHandler(type)

    if (handler.validate === undefined) {
      return handler.buildResponse(req, res, next)
    } else {
      handler.validate(req)
      return req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
          return res.status(400).json(result.array())
        }
      }).then(function () {
        return handler.buildResponse(req, res, next)
      })
    }
  }).catch(function (err) {
    next(err)
  })
})

module.exports = router
