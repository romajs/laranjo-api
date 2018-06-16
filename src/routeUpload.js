var basicAuth = require('basic-auth')
var bytes = require('bytes')
var cloudinary = require('cloudinary')
var formidable = require('formidable')

var express = require('express')
var router = express.Router()

var config = require('./config')
var logger = require('./logger')
var model = require('./model')

cloudinary.config(config.get('cloudinary'))

function formatFile (file) {
  var format = [
    `name="${file.name}"`,
    `path="${file.path}"`,
    `type="${file.type}"`,
    `size=${file.size && bytes(file.size)} bytes`,
    `hash="${file.size && file.hash}"`,
    `lastModifiedDate="${file.size && file.lastModifiedDate}"`
  ]
  return format.join(', ')
}

router.use(function (req, res, next) {
  if (config.get('admin.auth.enabled')) {
    var auth = basicAuth(req)
    if (auth === undefined || (auth.name !== config.get('admin.auth.username') && auth.pass !== config.get('admin.auth.password'))) {
      return res.status(401).end()
    }
  }
  return next()
})

router.get('/upload', function (req, res, next) {
  return model.Attachment.find(req.query).then(function (attachments) {
    if (attachments.length === 0) {
      return res.status(204).end()
    } else {
      return res.status(200).json(attachments)
    }
  })
})

router.post('/upload', function (req, res, next) {
  var form = new formidable.IncomingForm()

  form.encoding = 'utf-8'
  form.hash = 'md5'
  form.keepExtensions = true
  form.maxFileSize = bytes(config.get('admin.upload.maxFileSize'))
  form.multiples = false
  form.type = 'multipart'
  form.uploadDir = '/tmp'

  form.on('field', function (name, value) {
    logger.debug(`received field: name="${name}", value="${value}"`)
  })

  form.on('fileBegin', function (name, file) {
    logger.debug(`receiving file: ${formatFile(file)}`)
  })

  form.on('file', function (name, file) {
    logger.debug(`received file: ${formatFile(file)}`)
  })

  form.on('progress', function (recv, total) {
    var progress = Number(recv / total * 100).toFixed(2)
    logger.silly(`progress: ${progress}% (${bytes(recv)})`)
  })

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err)
    }

    var file = files.file

    if (!file) {
      logger.debug('No file attached.')
      return res.status(400).end()
    }

    var tags = fields.tags ? fields.tags.split(',').map(s => s.trim()) : []

    logger.debug(`uploading file: ${formatFile(file)}, tags="${tags}"`)

    function cloudinaryCallback (cloudinaryResult) {
      logger.debug('cloudinaryResult:', cloudinaryResult)

      if (!cloudinaryResult || cloudinaryResult.error) {
        return next(cloudinaryResult.error)
      }

      var attachment = new model.Attachment({
        name: file.name,
        type: [cloudinaryResult.resource_type, cloudinaryResult.format].join('/'),
        size: cloudinaryResult.bytes,
        hash_md5: file.hash,
        created_at: new Date(),
        url: cloudinaryResult.url,
        tags: tags
      })

      logger.silly('new attachment="%j"', attachment)

      return attachment.save().then(function (attachment) {
        return res.status(200).json(attachment)
      }).catch(function (err) {
        return next(err)
      })
    }

    return cloudinary.uploader.upload(file.path, cloudinaryCallback)
  })
})

router.delete('/upload/:id', function (req, res, next) {
  req.checkParams('id').isObjectId()

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(function () {
    return model.Attachment.findById(req.params.id).then(function (attachment) {
      logger.debug('found attachment="%j"', attachment)

      if (attachment === null) {
        return res.status(404).end()
      }

      return attachment.remove().then(function () {
        return res.status(204).end()
      }).catch(function (err) {
        return next(err)
      })
    })
  })
})

module.exports = router
