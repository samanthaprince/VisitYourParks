'use strict';

let parser = require('body-parser');
let Parks = require(__dirname + '/../models/park_model');
let jwtAuth = require(__dirname + '/../lib/jwt_auth');

module.exports = (router) => {
  router.use(parser.json());

  router.route ('/parks')
    .get(jwtAuth, (req, res) => {
      Parks.find({}, (err, parks) => {
        res.json({data: parks});
      });
    })
    .post(jwtAuth, (req, res) => {
      var newPark = new Parks(req.body);
      newPark.save((err, park) => {
        res.json(park);
      });
    });

  router.route('/parks/:id')
    .get(jwtAuth, (req, res) => {
      Parks.findById(req.params.id, (err, park) => {
        res.json(park);
      });
    });

//To search for a specific park by name
  router.route('/search')
    .get(jwtAuth, (req, res) => {
      var parkName = JSON.parse(req.query.name);
      console.log('parkName: ', parkName);
      Parks.find({'properties.UNIT_NAME': parkName}, (err, parks)=> {
        res.json(parks);
      });
    });

//To search for parks within a state
  router.route('/state')
    .get(jwtAuth, (req, res) => {
      var stateParks = JSON.parse(req.query.state);
      console.log('parkName: ', stateParks);
      Parks.find({'properties.STATE': stateParks}, (err, parks)=> {
        res.json(parks);
      });
    });


};
