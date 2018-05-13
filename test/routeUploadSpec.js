var fs = require('fs')

var cloudinary = require('cloudinary')
var request = require('supertest')
var sinon = require('sinon')
var tmp = require('tmp')

var app = require('../src/app')
var model = require('../src/model')

describe('Routing upload request', function () {
  var uploadStub
  var attachmentStub

  before(function () {
    uploadStub = sinon.stub(cloudinary.uploader, 'upload')
    attachmentStub = sinon.stub(model, 'Attachment')
  })

  after(function () {
    uploadStub.restore()
    attachmentStub.restore()
  })

  it('Should upload file and save attachment', function () {
    var tmpFile = tmp.fileSync()
    var sizeInBytes = fs.statSync(tmpFile.name).size

    uploadStub.yields({
      bytes: sizeInBytes,
      format: 'jpg',
      resource_type: 'image',
      url: 'http://localhost:8000/image/upload/v0123456789/dm8tdGktZGEtdS1zaHV0aQo='
    })

    attachmentStub.returns({
      save: sinon.stub().resolves({})
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
      error: {
      }
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
