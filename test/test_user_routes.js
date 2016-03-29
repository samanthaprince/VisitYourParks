'use strict';

let mongoose = require('mongoose');
let chai = require('chai');
let chaihttp = require('chai-http');
chai.use(chaihttp);
let request = chai.request;
let expect = chai.expect;

process.env.MONGO_LAB = 'mongodb://localhost/test';
require(__dirname + '/../server');

describe('Integration Tests (User Routes)', () => {

  var user1ID,
    authToken,
    adminID,
    adminToken;

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

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  describe('Test user routes:', () => {
    it('should deny access to user array without admin flag', (done) => {
      request('localhost:3000')
        .get('/users')
        .set('token', authToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(Array.isArray(res.body.data)).to.eql(false);
          expect(res.body.msg).to.eql('Access denied');
          done();
        });
    });

    it('should allow access to user array with an admin flag', (done) => {
      request('localhost:3000')
        .get('/users')
        .set('token', adminToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(Array.isArray(res.body.data)).to.eql(true);
          done();
        });
    });

    it('should allow a user to view her own data', (done) => {
      request('localhost:3000')
        .get('/users/' + user1ID)
        .set('token', authToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.fullName).to.equal('User One');
          expect(res.body).to.have.property('_id');
          done();
        });
    });

    it('should not allow a user to view someone else\'s data', (done) => {
      request('localhost:3000')
        .get('/users/' + adminID)
        .set('token', authToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Access denied');
          done();
        });
    });

    it('should allow a user to update her own data', (done) => {
      request('localhost:3000')
        .put('/users/' + user1ID)
        .set('token', authToken)
        .send({
          fullName: 'A Real User'
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should not allow a user to update someone else\'s data', (done) => {
      request('localhost:3000')
        .put('/users/' + adminID)
        .set('token', authToken)
        .send({
          fullName: 'A Real User'
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Access denied');
          done();
        });
    });

    it('should not allow non-admins to delete a user', (done) => {
      request('localhost:3000')
        .del('/users/' + user1ID)
        .set('token', authToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Access denied');
          done();
        });
    });

    it('should allow an admin to delete a user', (done) => {
      request('localhost:3000')
        .del('/users/' + user1ID)
        .set('token', adminToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('User removed');
          done();
        });
    });
  });

});

