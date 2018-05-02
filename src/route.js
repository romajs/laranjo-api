var express = require('express')
var router = express.Router()

var eventPaylod = {
  "type": "MESSAGE",
  "eventTime": "2017-03-02T19:02:59.910959Z",
  "space": {
    "name": "spaces/AAAAAAAAAAA",
    "displayName": "Some Discussion Room",
    "type": "ROOM"
  },
  "message": {
    "name": "spaces/AAAAAAAAAAA/messages/CCCCCCCCCCC",
    "sender": {
      "name": "users/12345678901234567890",
      "displayName": "Chris Corgi",
      "avatarUrl": "https://lh3.googleusercontent.com/.../photo.jpg",
      "email": "chriscorgi@example.com"
    },
    "createTime": "2017-03-02T19:02:59.910959Z",
    "text": "shuti",
    "thread": {
      "name": "spaces/AAAAAAAAAAA/threads/BBBBBBBBBBB"
    }
  }
}

router.post('/', function (req, res, next) {

  req.checkBody('text', 'required').notEmpty()
  req.checkBody('space.name', 'required').notEmpty()
  req.checkBody('message.thread.name', 'required').notEmpty()
  
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(function () {
    var text = 'VO TI DA U SHUTI'
    var spaceId = req.body.space.name
    var threadId = req.body.message.thread.name
    return res.json({
      "text": text,
      "thread": {
         "name": `spaces/${spaceId}/threads/${threadId}`
      }
    })
  })
})

router.get('/', function (req, res, next) {
  return res.write('VO TI DA U SHUTI')
})

module.exports = router
