'use strict';

let parser = require('body-parser');
let Parks = require(__dirname + '/../models/item_model');
// let jwtAuth = require(__dirname + '/../lib/jwt_auth');

module.exports = (router) => {
  router.use(parser.json());

  router.route('/geolocation/')
    .get((req, res) => {
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


  // Parks.findOne({}, (err, parks) => {



// db.parks.find({geometry:{$near:{$geometry:{type:"Point",coordinates:[-122.335167, 47.608013]},$maxDistance:100000}}})

// var currentLocation = [-122.335167, 47.608013];

// db.parks.find(
//   {
//     location:
//        { $near :
//        {
//          $geometry: { type: 'Point',  coordinates: [ longitude, latitude ] },
//          //min and max distance in meters
//          $minDistance: 0,
//          $maxDistance: 321869
//        }
//     }
//   });
