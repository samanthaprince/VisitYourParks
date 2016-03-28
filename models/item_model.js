'use strict';

const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  type:         {type: String},
  properties:   {code: String, name: String },
  geometry:     {
    type: {type: String},
    coordinates: [Number]
  }
});

module.exports = mongoose.model('Items', itemSchema);
