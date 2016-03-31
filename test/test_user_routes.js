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
    adminToken,
    park1ID,
    park2ID,
    park3ID,
    park4ID,
    park5ID;

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
        if (err) return console.log(err);
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

  before((done) => {
    request('localhost:3000')
      .post('/parks')
      .set('token', adminToken)
      .send({
        'geometry': {
          'coordinates':[-122.6992830597305, 48.206276500082225],
          'type' : 'Point' 
        },
        'properties': {
          'UNIT_TYPE':'National Historical Reserve',
          'STATE':'WA',
          'REGION':'PW',
          'UNIT_CODE':'EBLA',
          'UNIT_NAME':'Ebey\'s Landing',
          'PARKNAME':'Ebey\'s Landing'
        }
      })
      .end((err, res) => {
        if (err) return console.log(err);
        park1ID = res.body._id;
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .post('/parks')
      .set('token', adminToken)
      .send({
        'geometry': {
          'coordinates':[-121.78620386009118, 46.85444713025396],
          'type': 'Point'
        },
        'properties': {
          'UNIT_TYPE':'National Park',
          'STATE':'WA',
          'REGION':'PW',
          'UNIT_CODE':'MORA',
          'UNIT_NAME':'Mount Rainier National Park',
          'PARKNAME':'Mount Rainier'
        }
      })
      .end((err, res) => {
        if (err) return console.log(err);
        park2ID = res.body._id;
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .post('/parks')
      .set('token', adminToken)
      .send({
        'geometry': {
          'coordinates':[-123.06697175920439,48.5235409051443],
          'type':'Point'
        },
        'properties': {
          'UNIT_TYPE':'National Historical Park',
          'STATE':'WA',
          'REGION':'PW',
          'UNIT_CODE':'SAJH',
          'UNIT_NAME':'San Juan Island',
          'PARKNAME':'San Juan Island'
        } 
      })
      .end((err, res) => {
        if (err) return console.log(err);
        park3ID = res.body._id;
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .post('/parks')
      .set('token', adminToken)
      .send({
        'geometry': {
          'coordinates':[-123.92825143094836,47.87210847736174],
          'type':'Point'
        },
        'properties': {
          'UNIT_TYPE':'National Park',
          'STATE':'WA',
          'REGION':'PW',
          'UNIT_CODE':'OLYM',
          'UNIT_NAME':'Olympic National Park',
          'PARKNAME':'Olympic National Park'
        }
      })
      .end((err, res) => {
        if (err) return console.log(err);
        park4ID = res.body._id;
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .post('/parks')
      .set('token', adminToken)
      .send({
        'geometry': {
          'coordinates':[-121.13649091338272,48.68493561334914],
          'type':'Point'
        },
        'properties': {
          'UNIT_TYPE':'National Park',
          'STATE':'WA',
          'REGION':'PW',
          'UNIT_CODE':'NOCA',
          'UNIT_NAME':'North Cascades',
          'PARKNAME':'North Cascades'
        }
      })
      .end((err, res) => {
        if (err) return console.log(err);
        park5ID = res.body._id;
        done();
      });
  });

  // one park in db should be out of range
  before((done) => {
    request('localhost:3000')
      .post('/parks')
      .set('token', adminToken)
      .send({
        'geometry': {
          'coordinates':[-75.73711369973344,35.48548148196333],
          'type':'Point'
        },
        'properties': {
          'UNIT_TYPE':'National Seashore',
          'STATE':'NC',
          'REGION':'SE',
          'UNIT_CODE':'CAHA',
          'UNIT_NAME':'Cape Hatteras',
          'PARKNAME':'Cape Hatteras'
        }
      })
      .end((err) => {
        if (err) return console.log(err);
        done();
      });
  });

  before((done) => {
    request('localhost:3000')
      .put('/users/' + adminID)
      .set('token', adminToken)
      .send({
        list: [ 
          {'item': park1ID},
          {'item': park2ID},
          {'item': park3ID},
          {'item': park4ID},
          {'item': park5ID}
        ] 
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

    it('should allow a user to view her own list', (done) => {
      request('localhost:3000')
        .get('/users/' + adminID + '/list') 
        .set('token', adminToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(Array.isArray(res.body)).to.eql(true);
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
