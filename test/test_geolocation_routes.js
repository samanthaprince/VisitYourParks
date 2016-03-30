'use strict';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let request = chai.request;

process.env.TEST_DB = 'mongod://localhost/test'
require(__dirname + '/../server');

describe('test geolocation route', () => {
  var userId;
  var authToken;

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'Test User',
        email: 'testUser4@codefellows.org',
        password: 'test123456'
      })
      .end((err, res) => {
        userId = res.body._id;
        authToken = res.body.token;
        done();
      });
  });
  it('should get all items in the db within a 200 mile radius of the lat and long', function(done) {
    request('localhost:3000')
      .get('/geolocation/?longitude=-122.335167&latitude=47.608013')
      .set('token', authToken)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status('200');
        expect(res).to.have.property('text');
        expect(res.text).to.be.a('string');
        done();
      });
  });
});
