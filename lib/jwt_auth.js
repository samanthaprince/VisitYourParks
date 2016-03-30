'use strict';

let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/user_model');

module.exports = exports = (req, res, next) => {
  var decoded;

  try {
    decoded = jwt.verify(req.headers.token, process.env.SECRET
        || 'CHANGEME');
  } catch(e) {
    return res.status(401).json({msg: 'Authentication failed'});
  }
  User.findOne({_id: decoded.id}, (err, user) => {
    if (err) {
      return res.status(401).json({msg: 'User not found'});
    }

    if (!user) return res.status(401).json({msg: 'User not found'});

    req.user = user;
    next();
  });
};
