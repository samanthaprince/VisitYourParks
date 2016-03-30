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
  var adminID
  var adminToken;

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'User One',
        email: 'user1@example.gov',
        password: '12345678'
      })
      .end((err, res) => {
        if (err) return console.log(err);
        user1ID = res.body._id;
        authToken = res.body.token;
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'Admin User',
        email: 'admin@example.org',
        password: '1234567890'
      })
      .end((err, res) => {
        adminID = res.body._id;
        adminToken = res.body.token;
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .put('/users/' + adminID)
      .set('token', adminToken)
      .send({
        admin: 'true'
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('success');
        done();
      });
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
