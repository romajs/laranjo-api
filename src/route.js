var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  return res.write('VO TI DA U SHUTI', 200)
})

module.exports = router
