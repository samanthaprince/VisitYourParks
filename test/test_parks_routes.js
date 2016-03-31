'use strict';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let request = chai.request;

let Parks = require(__dirname + '/../models/park_model');


process.env.TEST_DB = 'mongodb://localhost/test';
require(__dirname + '/../server');

describe('test Parks REST with authentication', function() {
  var token;

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'User',
        email: 'user41@example.gov',
        password: '12345678'
      })
      .end((err, res) => {
        if (err) console.log(err);
        console.log('token: ' + token);
        token = res.body.token;
        done();
      });
  });

  it('should get all parks in db', function(done) {
    request('localhost:3000')
    .get('/parks')
    .set('token', token)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      done();
    });
  });

  it('should be able to create a new park', function(done) {
    request('localhost:3000')
     .post('/parks')
     .set('token', token)
     .send({'properties.UNIT_NAME': 'great park'})
     .end(function(err, res) {
       expect(err).to.eql(null);
       expect(res.body.properties.UNIT_NAME).to.eql('great park');
       expect(res.body.properties).to.have.property('UNIT_NAME');
       done();
     });
  });

  describe('needs a park to work with', function() {
    beforeEach(function(done) {
      var testPark = new Parks({'properties.UNIT_NAME': 'test park'});
      testPark.save(function(err, data) {
        if(err) throw err;

        this.testPark = data;
        done();
      }.bind(this));
    });

    it('should be able to make a park in a beforeEach block', function() {
      expect(this.testPark.properties.UNIT_NAME).to.eql('test park');
      expect(this.testPark.properties.UNIT_NAME).to.be.a('String');
    });

    it('should be able to get park by _id', function(done){
      var id = this.testPark._id;
      request('localhost:3000')
      .get('/parks/' + id)
      .set('token', token)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        done();
      });
    });
  });
});
