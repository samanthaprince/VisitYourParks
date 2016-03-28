const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fullName:   String,
  email:      {type: String, requied: true, unique: true},
  password:   {type: String, required: true},
  // list:
});


module.exports = mongoose.model('Users', userSchema);
