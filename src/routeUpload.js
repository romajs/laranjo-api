var cloudinary = require('cloudinary')
var formidable = require('formidable')

var express = require('express')
var router = express.Router()

var config = require('./config')
var logger = require('./logger')
var model = require('./model')

var CLOUDINARY_CONFIG = config.get('cloudinary')
cloudinary.config(CLOUDINARY_CONFIG)

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
  form.maxFields = 1000
  form.maxFieldsSize = 1024 * 1024 * 2 // 2 MB
  form.multiples = false
  form.type = 'multipart'
  form.uploadDir = '/tmp'

  form.on('progress', function (recv, total) {
    logger.silly('received: %s % (%s / %s bytes)', Number(recv / total * 100).toFixed(2), recv, total)
  })

  form.on('error', function (err) {
    next(err)
  })

  form.on('aborted', function (name, file) {
    logger.warn('aborted: name="%s", path="%s", type="%s", size=%s bytes', file.name, file.path, file.type, file.size)
    res.status(308).end()
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

    logger.debug('file: name="%s", path="%s", type="%s", size=%s bytes, hash="%s", lastModifiedDate="%s", tags="%s"',
      file.name, file.path, file.type, file.size, file.hash, file.lastModifiedDate, tags)

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

      logger.silly('New attachment="%j"', attachment)

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
      logger.debug('Found attachment="%j"', attachment)

      if (attachment === null) {
        return res.status(404).end()
      }

      return cloudinary.api.delete_resources(attachment.cloudinary_id, function (cloudinaryResult) {
        logger.debug('cloudinaryResult:', cloudinaryResult)

        if (!cloudinaryResult || cloudinaryResult.error) {
          return next(cloudinaryResult.error)
        }

        return attachment.remove().then(function () {
          return res.status(204).end()
        }).catch(function (err) {
          return next(err)
        })
      })
    })
  })
})

module.exports = router
