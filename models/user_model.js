'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullName:   String,
  email:      {type: String, requied: true, unique: true},
  password:   {type: String, required: true},
  admin:      {type: Boolean, default: false},
  list:       [{type: Schema.Types.ObjectId, ref: 'Lists'}]
});

userSchema.methods.hashPassword = function(password) {
  var hash = this.password = bcrypt.hashSync(password, 10);
  return hash;
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({id: this._id}, 'CHANGEME');
};

module.exports = mongoose.model('Users', userSchema);
