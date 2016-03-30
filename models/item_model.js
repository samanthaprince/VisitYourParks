'use strict';

const mongoose = require('mongoose');

const parksSchema = new mongoose.Schema({
 
  properties:   {UNIT_TYPE: String, UNIT_CODE: String, UNIT_NAME: String, PARKNAME: String, STATE: String, REGION: String },
  geometry:     {
    coordinates: [Number],
    type: {type: String}
    
  }
});

module.exports = mongoose.model('Parks', parksSchema);
