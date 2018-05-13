var request = require('supertest')
var sinon = require('sinon')

var app = require('../src/app')
var model = require('../src/model')

describe('Routing message event requests', function () {
  it('Should fail to handle unknown event request', function () {
    return request(app)
      .get('/')
      .expect(200)
      .expect('VO TI DA U SHUTI')
  })
  it('Should fail to handle unknown event request', function () {
    return request(app)
      .post('/')
      .send({
        'type': 'UNKNOWN'
      })
      .expect(500)
      .expect('Content-Type', /application\/json/)
  })
  it('Should fail to handle event request without type defined', function () {
    return request(app)
      .post('/')
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
  it('Should handle added to space event request', function () {
    return request(app)
      .post('/')
      .send({
        'type': 'ADDED_TO_SPACE'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({
        'text': 'VO TI DA U SHUTI'
      })
  })
  describe('Should handle message event request properly', function () {
    var findOneStub
    before(function () {
      findOneStub = sinon.stub(model.Attachment, 'findOne')
    })
    after(function () {
      findOneStub.restore()
    })
    it('With attachment found', function () {
      findOneStub.resolves({
        url: 'http://localhost:8000/image/upload/v0123456789/dm8tdGktZGEtdS1zaHV0aQo='
      })
      return request(app)
        .post('/')
        .send({
          'type': 'MESSAGE',
          'message': {
            'argumentText': 'VO TI DA U SHUTI'
          }
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect({
          'cards': [{
            'sections': [{
              'widgets': [{
                'image': {
                  'imageUrl': 'http://localhost:8000/image/upload/v0123456789/dm8tdGktZGEtdS1zaHV0aQo='
                }
              }]
            }]
          }]
        })
    })
    it('With no attachment found', function () {
      findOneStub.resolves(null)
      return request(app)
        .post('/')
        .send({
          'type': 'MESSAGE',
          'message': {
            'argumentText': 'VO TI DA U SHUTI'
          }
        })
        .expect(404)
    })
  })
})
