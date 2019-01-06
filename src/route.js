const express = require('express')

const logger = require('./logger')
const config = require('./config')
const routeEventHandler = require('./routeEventHandler')

const router = express.Router()

router.use((req, res, next) => {
  const authEnabled = config.get('googleHangoutsChat.auth.enabled')
  const token = config.get('googleHangoutsChat.auth.token')
  if (authEnabled === true && req.body.token !== token) {
    return res.status(401).end()
  }
  return next()
})

router.get('/', (req, res, next) => {
  return res.end('VO TI DA U SHUTI')
})

router.post('/', (req, res, next) => {
  logger.silly('Request body:', req.body)

  req.checkBody('type', 'required').notEmpty()

  return req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(() => {
    const type = req.body.type
    const handler = routeEventHandler(type)

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
