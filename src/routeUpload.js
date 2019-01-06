const basicAuth = require('basic-auth')
const bytes = require('bytes')
const cloudinary = require('cloudinary')
const express = require('express')
const formidable = require('formidable')

const config = require('./config')
const logger = require('./logger')
const model = require('./model')

cloudinary.config(config.get('cloudinary'))

const formatFile = (file) => [
  `name="${file.name}"`,
  `path="${file.path}"`,
  `type="${file.type}"`,
  `size=${file.size && bytes(file.size)} bytes`,
  `hash="${file.size && file.hash}"`,
  `lastModifiedDate="${file.size && file.lastModifiedDate}"`
].join(', ')

const router = express.Router()

router.use((req, res, next) => {
  if (config.get('admin.auth.enabled')) {
    const auth = basicAuth(req)
    const [username, password] = [config.get('admin.auth.username'), config.get('admin.auth.password')]
    if (auth === undefined || (auth.name !== username || auth.pass !== password)) {
      return res.status(401).end()
    }
  }
  return next()
})

router.get('/upload', (req, res, next) => {
  return model.Attachment.find(req.query).then((attachments) => {
    if (attachments.length === 0) {
      return res.status(204).end()
    } else {
      return res.status(200).json(attachments)
    }
  })
})

router.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm()

  form.encoding = 'utf-8'
  form.hash = 'md5'
  form.keepExtensions = true
  form.maxFileSize = bytes(config.get('admin.upload.maxFileSize'))
  form.multiples = false
  form.type = 'multipart'
  form.uploadDir = '/tmp'

  form.on('field', (name, value) => {
    logger.debug(`received field: name="${name}", value="${value}"`)
  })

  form.on('fileBegin', (name, file) => {
    logger.debug(`receiving file: ${formatFile(file)}`)
  })

  form.on('file', (name, file) => {
    logger.debug(`received file: ${formatFile(file)}`)
  })

  form.on('progress', (recv, total) => {
    const progress = Number(recv / total * 100).toFixed(2)
    logger.silly(`progress: ${progress}% (${bytes(recv)})`)
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err)
    }

    const file = files.file

    if (!file) {
      logger.debug('No file attached.')
      return res.status(400).end()
    }

    const tags = fields.tags ? fields.tags.split(',').map(s => s.trim()) : []
    logger.debug(`uploading file: ${formatFile(file)}, tags="${tags}"`)

    return cloudinary.uploader.upload(file.path, (cloudinaryResult) => {
      logger.debug('cloudinaryResult:', cloudinaryResult)

      if (!cloudinaryResult || cloudinaryResult.error) {
        return next(cloudinaryResult.error)
      }

      const attachment = new model.Attachment({
        name: file.name,
        type: [cloudinaryResult.resource_type, cloudinaryResult.format].join('/'),
        size: cloudinaryResult.bytes,
        hash_md5: file.hash,
        created_at: new Date(),
        url: cloudinaryResult.url,
        tags: tags
      })

      logger.silly('new attachment="%j"', attachment)

      return attachment.save().then((attachment) => {
        return res.status(200).json(attachment)
      }).catch((err) => {
        return next(err)
      })
    })
  })
})

router.delete('/upload/:id', (req, res, next) => {
  req.checkParams('id').isObjectId()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).json(result.array())
    }
  }).then(() => {
    return model.Attachment.findById(req.params.id).then((attachment) => {
      logger.debug('found attachment="%j"', attachment)

      if (attachment === null) {
        return res.status(404).end()
      }

      return attachment.remove().then(() => {
        return res.status(204).end()
      }).catch((err) => {
        return next(err)
      })
    })
  })
})

module.exports = router
