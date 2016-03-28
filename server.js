'use strict';

let express = require('express');
let mongoose = require('mongoose');
let morgan = require('morgan');

const PORT = process.env.PORT || 3000;

const MONGO_DB = process.env.MONGO_DB || 'mongodb://user:pass@host:port/db';
mongoose.connect(MONGO_DB);

let authRouter = express.Router();
require(__dirname + '/routes/auth_routes')(authRouter);

let apiRouter = express.Router();
require(__dirname + '/routes/user_routes');

let app = module.exports = exports = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(morgan('dev'));
app.use('/', authRouter);
app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});

