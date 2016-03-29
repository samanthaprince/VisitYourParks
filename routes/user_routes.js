'use strict';

let parser = require('body-parser');
let User = require(__dirname + '/../models/user_model');
let jwtAuth = require(__dirname + '/../lib/jwt_auth');
let handleDBError = require(__dirname + '/../lib/handle_db_error');

module.exports = (router) => {
  router.use(parser.json());

  router.route('/users')
    .get(jwtAuth, (req, res) => {
      if (req.user.admin) { 
        User.find({}, (err, users) => {
          if (err) return handleDBError(err, res);
          res.json({data: users});
        });
      } else {
        return res.json({msg: 'Access denied'});
      }
    });

  router.route('/users/:user')
    .get(jwtAuth, (req, res) => {
      if (req.params.user == req.user._id || req.user.admin) {
        User.findById(req.params.user, (err, user) => {
          if (err) return handleDBError(err, res);
          res.json(user);
        });
      } else {
        return res.json({msg: 'Access denied'});
      }
    })

    .put(jwtAuth, (req, res) => {
      if (req.params.user == req.user._id || req.user.admin) {
        User.findByIdAndUpdate(req.params.user, req.body, (err) => {
          if (err) return handleDBError(err, res);
          res.json({msg: 'success'});
        });
      } else {
        return res.json({msg: 'Access denied'});
      }
    })

    .delete(jwtAuth, (req, res) => {
      if (req.user.admin) {
        User.findById(req.params.user, (err, user) => {
          user.remove((err) => {
            if (err) return handleDBError(err, res);
            res.json({msg: 'User removed'});
          });
        });
      } else {
        return res.json({msg: 'Access denied'});
      }
    });
};

