//
// index.js is the Main starting point of the application
//

// load dotenv as early as possible
// require('dotenv').config();

//
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// const mongoose = require('mongoose');
// const cookieSession = require('cookie-session');
// const passport = require('passport');
// const cors = require('cors');

// ---------------------------------------------------------------------
// DB setup
//
// mongoose.Promise = global.Promise;
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('Database connected...'))
//   .catch(e => console.log('Database connection error: ', e));

// ---------------------------------------------------------------------

// The order of middler is important!!!
//
// Take a look at the following link to see how to configure Passport
// https://github.com/mstade/passport-google-oauth2/blob/master/example/app.js

// Passport configuration first
//
// require('./services/passport');

// configure Express
//
const app = express();

// App Setup
//
// these are middlewares; must be called before our application
//
// morgan: HTTP request logger middleware
//         'combined': standard Apache combined log output
app.use(morgan('combined'));
//
// serve static files
// '/' is a virtual path, which is mapped to '/public' folder
app.use('/', express.static(path.join(__dirname, 'public')));

// allow CORS requests
//
// app.use(cors());
//
// body-parser: parse request bodies, available under the req.body property
//              json({type: '*/*'}) - parse as JSON for any request
app.use(bodyParser.json());

// ---------------------------------------------------------------------

// App routes
//
require('./routes/upload')(app);

// error handling middleware - catch all the errors here
//
app.use((err, req, res, next) => {
  console.log('*** error handling middleware ***', err);
  res.status(422).send({ error: err.message });
});

// ---------------------------------------------------------------------

// Server Setup
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
console.log(`Server running at http://localhost:${port}/`);
