'use strict';

let parser = require('body-parser');
let Parks = require(__dirname + '/../models/park_model');
let User = require(__dirname + '/../models/user_model');
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

  router.route('/userGeo/:user/geolocation/')
    .get(jwtAuth, (req, res) => {
      var userParks;
      var longitude = req.query.longitude;
      var latitude = req.query.latitude;
      console.log('hit GET user id geolocation route');
      if (req.params.user || req.user.admin) {
        Parks.find({geometry:{$near:{$geometry:{type:'Point',coordinates:[longitude, latitude]},$maxDistance:321869}}}, (err, parks) => {
          if (err) {
            console.log(err);
          }
          User.findById(req.params.user, (err, user) => {
            userParks = user.list;
            console.log('user ob length ', userParks.length);
            if (err) {
              console.log(err);
            }
            var parksInRange = [];
            for(var i = 0; i < parks.length; i++) {
              for(var j = 0; j < userParks.length; j++) {
                console.log('parksinrange', parks[i]);
                console.log(userParks[j]);
                if (JSON.stringify(parks[i]._id) == JSON.stringify(userParks[j].item)) {
                  parksInRange.push(parks[i]);
                }
              }
            }
            res.json(parksInRange);
          });
        });
      }
    }
  );
};
