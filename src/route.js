var express = require('express')
var router = express.Router()

var routeEventHandler = rootRequire('routeEventHandler')

// var eventPaylod = {
//   "type": "MESSAGE",
//   "eventTime": "2017-03-02T19:02:59.910959Z",
//   "space": {
//     "name": "spaces/AAAAAAAAAAA",
//     "displayName": "Some Discussion Room",
//     "type": "ROOM"
//   },
//   "message": {
//     "name": "spaces/AAAAAAAAAAA/messages/CCCCCCCCCCC",
//     "sender": {
//       "name": "users/12345678901234567890",
//       "displayName": "Chris Corgi",
//       "avatarUrl": "https://lh3.googleusercontent.com/.../photo.jpg",
//       "email": "chriscorgi@example.com"
//     },
//     "createTime": "2017-03-02T19:02:59.910959Z",
//     "text": "shuti",
//     "thread": {
//       "name": "spaces/AAAAAAAAAAA/threads/BBBBBBBBBBB"
//     }
//   }
// }

router.post('/', function (req, res, next) {

  req.checkBody('type', 'required').notEmpty()

  return req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(function () {

    var type = req.body.type
    var handler = routeEventHandler(type)

    if(handler.validate === undefined) {
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

  }).catch(function(err) {
    next(err)
  })
  
})

router.get('/', function (req, res, next) {
  return res.write('VO TI DA U SHUTI')
})

module.exports = router
