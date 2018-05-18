var fs = require('fs')

var cloudinary = require('cloudinary')
var mongoose = require('mongoose')
var request = require('supertest')
var sinon = require('sinon')
var tmp = require('tmp')

var app = require('../src/app')
var config = require('../src/config')
var model = require('../src/model')

describe('Routing upload request', function () {
  describe('With authentication enabled', function () {
    var findStub

    before(function () {
      config.set('admin.auth.enabled', true)
      config.set('admin.auth.username', 'TEST_USER')
      config.set('admin.auth.password', 'TEST_PASS')
      findStub = sinon.stub(model.Attachment, 'find')
    })

    after(function () {
      findStub.restore()
    })

    it('Should authenticate sucessfully', function () {
      findStub.resolves([])

      return request(app)
        .get('/upload')
        .auth('TEST_USER', 'TEST_PASS')
        .expect(204)
    })

    it('Should fail to authenticate with wrong auth', function () {
      findStub.resolves([])

      return request(app)
        .get('/upload')
        .auth('TEST_WRONG_USER', 'TEST_WRONG_PASS')
        .expect(401)
    })

    it('Should fail to authenticate with no auth', function () {
      findStub.resolves([])

      return request(app)
        .get('/upload')
        .expect(401)
    })
  })

  describe('With authentication disabled', function () {
    before(function () {
      config.set('admin.auth.enabled', false)
    })

    describe('Should handle upload request /GET', function () {
      var findStub

      before(function () {
        findStub = sinon.stub(model.Attachment, 'find')
      })

      after(function () {
        findStub.restore()
      })

      it('Should find attachments', function () {
        var attachmentId = mongoose.Types.ObjectId('ATTACHMENTID')

        findStub.resolves([{
          'id': attachmentId
        }])

        return request(app)
          .get('/upload')
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .expect([{
            'id': '' + attachmentId
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
      })

      it('Should upload file and failed to save attachment', function () {
        var tmpFile = tmp.fileSync()

        attachmentStub.returns({
          save: sinon.stub().rejects()
        })

        uploadStub.yields({
        })

        return request(app)
          .post('/upload')
          .attach('file', tmpFile.name)
          .expect(500)
      })

      it('Should failed to upload for no file attached', function () {
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
          remove: sinon.stub().resolves()
        })

        return request(app)
          .delete('/upload/' + attachmentId)
          .expect(204)
      })

      it('Should failed to remove attachment', function () {
        var attachmentId = mongoose.Types.ObjectId('ATTACHMENTID')

        deleteResourcesStub.yields({
        })

        findByIdStub.resolves({
          remove: sinon.stub().rejects()
        })

        return request(app)
          .delete('/upload/' + attachmentId)
          .expect(500)
      })

      it('Should failed to delete attachment by id from cloudinary', function () {
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
})
