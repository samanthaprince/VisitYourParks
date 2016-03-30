'use strict';

let mongoose = require('mongoose');
let chai = require('chai');
let chaihttp = require('chai-http');
chai.use(chaihttp);
let request = chai.request;
let expect = chai.expect;

process.env.MONGO_LAB = 'mongodb://localhost/test';
require(__dirname + '/../server');

describe('Integration Tests (Authentication Routes)', () => {

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'User One',
        email: 'user1@example.gov',
        password: '12345678'
      })
      .end((err) => {
        if (err) return console.log(err);
        done();
      });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  describe('Test authentication routes:', () => {
    it('should deny access without an authentication token', (done) => {
      request('localhost:3000')
        .get('/users')
        .end((err, res) => {
          expect(res.status).to.eql(401);
          expect(res.body.msg).to.equal('Authentication failed');
          done();
        });
    });

    it('should create a new user', (done) => {
      request('localhost:3000')
        .post('/signup')
        .send({
          fullName: 'User Two',
          email: 'user2@example.gov',
          password: '12345678'
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should create another user', (done) => {
      request('localhost:3000')
        .post('/signup')
        .send({
          fullName: 'User Three',
          email: 'user3@example.gov',
          password: '12345678'
        })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        done();
      });
    });

    it('should require a unique email address', (done) => {
      request('localhost:3000')
        .post('/signup')
        .send({
          fullName: 'User Four',
          email: 'user3@example.gov',
          password: '12345678'
        })
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.msg).to.eql('That account already exists');
          done();
        });
    });
  });

  describe('Test token generation:', () => {
    before((done) => {
      request('localhost:3000')
        .post('/signup')
        .send({
          fullName: 'User Five',
          email: 'user5@example.gov',
          password: '12345678'
        })
        .end(() => {
          done();
        });
    });

    it('should return a token on successful signin', (done) => {
      request('localhost:3000')
        .get('/signin')
        .auth('user5@example.gov', '12345678')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

});
