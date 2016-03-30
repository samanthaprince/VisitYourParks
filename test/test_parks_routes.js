'use strict';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let request = chai.request;


// process.env.MONGO_LAB = 'mongodb://localhost/testdb';
// require(__dirname + '/../server');

describe('test Parks REST with authentication', function() {
  var token;

  // after(function(done) {
  //   mongoose.connection.db.dropDatabase(function() {
  //     done();
  //   });
  // });

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'User',
        email: 'user3@example.gov',
        password: '12345678'
      })
      .end((err, res) => {
        if (err) console.log(err);
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

  it('should be able to get park by _id', function(done){
    request('localhost:3000')
    .get('/parks/:id')
    .set('token', token)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.id).to.have.property('_id');
      done();
    });
  });

  it('should be able to create a new park', function(done) {
    request('localhost:3000')
     .post('/parks')
     .set('token', token)
     .send({name: 'great park'})
     .end(function(err, res) {
       expect(err).to.eql(null);
       expect(res.body.properties.name).to.eql('great park');
       expect(res.body.properties).to.have.property('name');
       done();
     });
  });
});
