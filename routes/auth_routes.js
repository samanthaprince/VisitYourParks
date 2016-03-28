'use strict';

let parser = require('body-parser').json();
let handleDBError = require('./../lib/handle_db_error');
let basicHTTP = require('./../lib/basic_http');
let User = require('./../models/user_model');

module.exports = (router) => {

  router.post('/signup', parser, (req, res) => {
    User.findOne({'username': req.body.username}, (err, user) => {
      if (err) return handleDBError(err, res); 
      if (user) {
        return res.status(400).json({msg: 'That username is already in use'});  
      } else {
        var newUser = new User();
        if (!((req.body.email || '').length
            && (req.body.password || '').length > 7)) {
          return res.status(400).json({msg: 'Invalid username or password'});
        } 
      
        newUser.username = req.body.username || req.body.email;
        newUser.authentication.email = req.body.email;
        newUser.hashPassword(req.body.password);
        newUser.save((err, data) => {
          if (err) return handleDBError(err, res);
          res.status(200).json({
            _id: data._id,
            token: data.generateToken()
          });
        });
      }
    });

  });

  router.get('/signin', basicHTTP, (req, res) => {
    User.findOne({'authentication.email': req.basicHTTP.email}, (err, user) => {
      if (err) {
        return res.status(401).json({msg: 'Authentication failed'});
      }
      
      if (!user) {
        return res.status(401).json({msg: 'User not found'});
      }

      if (!user.comparePassword(req.basicHTTP.password)) {
        return res.status(401).json({msg: 'Go away'});
      }

      res.json({token: user.generateToken()});      
    });
  }); 
    
};

