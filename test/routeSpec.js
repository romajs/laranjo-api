var request = require('supertest')
var sinon = require('sinon')
var unleash = require('unleash-client')

var app = require('../src/app')
var config = require('../src/config')
var model = require('../src/model')

describe('Routing message event requests', function () {
  var unleashIsEnabledStub

  before(function () {
    unleashIsEnabledStub = sinon.stub(unleash, 'isEnabled')
  })

  after(function () {
    unleashIsEnabledStub.restore()
  })

  describe('With authentication enabled', function () {
    before(function () {
      unleashIsEnabledStub.withArgs('googleHangoutsChat.auth.enabled').returns(true)
    })

    it('Should authenticate sucessfully', function () {
      config.set('googleHangoutsChat.auth.token', 'TEST_TOKEN')
      return request(app)
        .get('/')
        .send({
          'token': 'TEST_TOKEN'
        })
        .expect(200)
        .expect('VO TI DA U SHUTI')
    })

    it('Should fail to authenticate with wrong token', function () {
      config.set('googleHangoutsChat.auth.token', 'TEST_TOKEN')
      return request(app)
        .get('/')
        .send({
          'token': 'TEST_WRONG_TOKEN'
        })
        .expect(401)
    })

    it('Should fail to authenticate with no token', function () {
      return request(app)
        .get('/')
        .expect(401)
    })
  })

  describe('With authentication disabled', function () {
    before(function () {
      unleashIsEnabledStub.withArgs('googleHangoutsChat.auth.enabled').returns(false)
    })

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

      it('Should failed to validate', function () {
        return request(app)
          .post('/')
          .send({
            'type': 'MESSAGE'
          })
          .expect(400)
      })

      it('Should failed to find attachment', function () {
        findOneStub.rejects()

        return request(app)
          .post('/')
          .send({
            'type': 'MESSAGE',
            'message': {
              'argumentText': 'VO TI DA U SHUTI'
            }
          })
          .expect(500)
      })

      it('Should build response with attachment found', function () {
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

      it('Should build response with no attachment found', function () {
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
})
