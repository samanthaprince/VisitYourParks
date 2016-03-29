'use strict';

let parser = require('body-parser');
let User = require(__dirname + '/../models/user_model');
let handleDBError = require(__dirname + '/../lib/handle_db_error');
let jwtAuth = require(__dirname + '/../lib/jwt_auth');

module.exports = (router) => {
  router.use(parser.json());

  router.route('/users')
    .get(jwtAuth, (req, res) => {
      // add user.admin
      User.find({}, (err, users) => {
        if (err) return console.log(err);
        res.json({data: users});
      });
    });

  router.route('/users/:user')
    .get(jwtAuth, (req, res) => {
      User.findById(req.params.user, (err, user) => {
        if (err) return console.log(err);
        res.json(user);
      });
    })

    .put(jwtAuth, (req, res) => {
      User.findByIdAndUpdate(req.params.user, req.body, (err) => {
        if (err) return console.log(err);
        res.json({msg: 'success'});
      });
    })

    .delete(jwtAuth, (req, res) => {
      User.findById(req.params.user, (err, user) => {
        user.remove((err) => {
          if (err) return console.log(err);
          res.json({msg: 'User removed'});
        });
      });
    });
};
