require('../index') // FIXME

var request = require('supertest')
var app = rootRequire('main/app')

describe('Routing message event requests', function () {
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
  it('Should handle message event request', function () {
    return request(app)
        .post('/')
        .send({
          'type': 'MESSAGE',
          'eventTime': '2017-03-02T19:02:59.910959Z',
          'space': {
            'name': 'spaces/AAAAAAAAAAA',
            'displayName': 'Some Discussion Room',
            'type': 'ROOM'
          },
          'message': {
            'name': 'spaces/AAAAAAAAAAA/messages/CCCCCCCCCCC',
            'sender': {
              'name': 'users/12345678901234567890',
              'displayName': 'Chris Corgi',
              'avatarUrl': 'https://lh3.googleusercontent.com/.../photo.jpg',
              'email': 'chriscorgi@example.com'
            },
            'createTime': '2017-03-02T19:02:59.910959Z',
            'text': 'VO TI DA U SHUTI',
            'thread': {
              'name': 'spaces/AAAAAAAAAAA/threads/BBBBBBBBBBB'
            }
          }
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        // .expect({
        //   'cards': [{
        //     'sections': [{
        //       'widgets': [{
        //         'image': {
        //           'imageUrl': 'http://localhost:8000/img/vo-ti-da-u-shuti.jpg'
        //         }
        //       }]
        //     }]
        //   }]
        // })
  })
})
