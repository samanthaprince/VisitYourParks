'use strict';

let express = require('express');
let mongoose = require('mongoose');
let morgan = require('morgan');
const PORT = process.env.PORT || 3000;

const MONGO_LAB = process.env.MONGO_LAB;
mongoose.connect(MONGO_LAB);

let authRouter = express.Router();
require('./routes/auth_routes')(authRouter);

let apiRouter = express.Router();
require(__dirname + '/routes/user_routes')(apiRouter);

let parkRouter = express.Router();
require(__dirname + '/routes/parks_routes')(parkRouter);

let geolocationRouter = express.Router();
require(__dirname + '/routes/geolocation_routes')(geolocationRouter);

let app = module.exports = exports = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(morgan('dev'));
app.use('/', authRouter);
app.use('/', apiRouter);
app.use('/', parkRouter);
app.use('/', geolocationRouter);

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
