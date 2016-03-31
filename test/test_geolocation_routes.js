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

describe('test geolocation route', () => {
  var authToken;

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  before((done) => {
    request('localhost:3000')
      .post('/signup')
      .send({
        fullName: 'User One',
        email: 'user4@example.gov',
        password: '12345678'
      })
      .end((err, res) => {
        if (err) return console.log(err);
        authToken = res.body.token;
        done();
      });
  });

  beforeEach(function(done) {

    var testPark = new Parks ({
      properties:   {UNIT_TYPE: 'Mountain', UNIT_CODE: 'Mtn', UNIT_NAME: 'mtn', PARKNAME: 'Mount Rainier', STATE: 'WA', REGION: 'PNW' },
      geometry:     {
        coordinates: [-121.7603,46.8523],
        type: 'Point'
      }
    });

    testPark.save(function(err, data) {
      if(err) throw err;
      this.testPark = data;
    }.bind(this));
    done();
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
