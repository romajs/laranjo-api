var fs = require('fs')

var cloudinary = require('cloudinary')
var mongoose = require('mongoose')
var request = require('supertest')
var sinon = require('sinon')
var tmp = require('tmp')

var app = require('../src/app')
var model = require('../src/model')

describe('Routing upload request', function () {
  describe('Should handle upload request /GET', function () {
    var findStub

    before(function () {
      findStub = sinon.stub(model.Attachment, 'find')
    })

    after(function () {
      findStub.restore()
    })

    it('Should find attachments', function () {
      findStub.resolves([{
        'id': 'MDAwMDAwMDAwMDAwMDAwMQo='
      }])

      return request(app)
        .get('/upload')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect([{
          'id': 'MDAwMDAwMDAwMDAwMDAwMQo='
        }])
    })

    it('Should find attachments but empty', function () {
      findStub.resolves([])

      return request(app)
        .get('/upload')
        .expect(204)
    })
  })

  describe('Should handle upload request /POST', function () {
    var attachmentStub
    var uploadStub

    before(function () {
      attachmentStub = sinon.stub(model, 'Attachment')
      uploadStub = sinon.stub(cloudinary.uploader, 'upload')
    })

    after(function () {
      attachmentStub.restore()
      uploadStub.restore()
    })

    it('Should upload file and save attachment', function () {
      var tmpFile = tmp.fileSync()
      var sizeInBytes = fs.statSync(tmpFile.name).size

      attachmentStub.returns({
        save: sinon.stub().resolves({})
      })

      uploadStub.yields({
        bytes: sizeInBytes,
        format: 'jpg',
        resource_type: 'image',
        url: 'http://localhost:8000/image/upload/v0123456789/dm8tdGktZGEtdS1zaHV0aQo='
      })

      return request(app)
        .post('/upload')
        .field('tags', 'tag1, tag2, tag3')
        .attach('file', tmpFile.name)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    it('Should upload file and save attachment', function () {
      var tmpFile = tmp.fileSync()

      uploadStub.yields({
        error: {}
      })

      return request(app)
        .post('/upload')
        .attach('file', tmpFile.name)
        .expect(500)
        .expect('Content-Type', /application\/json/)
    })

    it('Should not upload file not attached', function () {
      return request(app)
        .post('/upload')
        .expect(400)
    })
  })

  describe('Should handle upload request /DELETE', function () {
    var deleteResourcesStub
    var findByIdStub

    before(function () {
      deleteResourcesStub = sinon.stub(cloudinary.api, 'delete_resources')
      findByIdStub = sinon.stub(model.Attachment, 'findById')
    })

    after(function () {
      deleteResourcesStub.restore()
      findByIdStub.restore()
    })

    it('Should delete attachment by id', function () {
      var attachmentId = mongoose.Types.ObjectId('ATTACHMENTID')

      deleteResourcesStub.yields({})

      findByIdStub.resolves({
        id: attachmentId,
        remove: sinon.stub().resolves()
      })

      return request(app)
        .delete('/upload/' + attachmentId)
        .expect(204)
    })

    it('Should failed to delete attachment by id', function () {
      var attachmentId = mongoose.Types.ObjectId('ATTACHMENTID')

      deleteResourcesStub.yields({
        error: {}
      })

      findByIdStub.resolves({
      })

      return request(app)
        .delete('/upload/' + attachmentId)
        .expect(500)
    })

    it('Should not find attachment with invalid id parameter', function () {
      var attachmentId = 'INVALID_ID'

      findByIdStub.resolves(null)

      return request(app)
        .delete('/upload/' + attachmentId)
        .expect(400)
    })

    it('Should not find attachment to delete', function () {
      var attachmentId = mongoose.Types.ObjectId('ATTACHMENTID')

      findByIdStub.resolves(null)

      return request(app)
        .delete('/upload/' + attachmentId)
        .expect(404)
    })
  })
})
