'use strict';

let parser = require('body-parser');
let Parks = require(__dirname + '/../models/item_model');
let jwtAuth = require(__dirname + '/../lib/jwt_auth');

module.exports = (router) => {
  router.use(parser.json());

  router.route ('/parks')
    .get((req, res) => {
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

  router.route('/search/')
    .get(jwtAuth, (req, res) => {
      var parkName = JSON.parse(req.query.properties.name);
      Parks.find({'properties name': parkName}, (err, parks)=> {
        res.json(parks);
      });
    });

};
