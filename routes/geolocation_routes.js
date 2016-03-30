'use strict';

let parser = require('body-parser');
let Parks = require(__dirname + '/../models/park_model');
let jwtAuth = require(__dirname + '/../lib/jwt_auth');

module.exports = (router) => {
  router.use(parser.json());

  router.route('/geolocation/')
    .get(jwtAuth, (req, res) => {
      var longitude = req.query.longitude;
      var latitude = req.query.latitude;
      Parks.find({geometry:{$near:{$geometry:{type:'Point',coordinates:[longitude, latitude]},$maxDistance:321869}}}, (err, parks) => {
        if (err) {
          console.log(err);
        }
        res.json({data: parks});
      });
    });
};
