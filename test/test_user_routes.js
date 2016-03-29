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

  var user1ID, authToken;

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

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  describe('Test user routes:', () => {
    it('should get an array of users', (done) => {
      request('localhost:3000')
        .get('/users')
        .set('token', authToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(Array.isArray(res.body.data)).to.eql(true);
          done();
        });
    });

    it('should get a user', (done) => {
      request('localhost:3000')
        .get('/users/' + user1ID)
        .set('token', authToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.username).to.equal('User One');
          expect(res.body).to.have.property('_id');
          done();
        });
    });

    it('should update a user', (done) => {
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

    it('should delete a user', (done) => {
      request('localhost:3000')
        .del
