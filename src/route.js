var express = require('express')
var router = express.Router()

var logger = require('./logger')
var routeEventHandler = require('./routeEventHandler')

router.post('/', function (req, res, next) {
  logger.silly('Request body:', req.body)
  req.checkBody('type', 'required').notEmpty()

  return req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(function () {
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
