var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var cors = require('cors');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MONGODB CONNECTED!!'))
        .catch(err => console.log(err));
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/users');
var talkRouter = require('./routes/talk/talk');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// match origin to your frontend, use .env
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN
  }
))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// all routes must have a common prefix - /api is standard 
// this to so nginx can use path routing to properly forward backend request
app.use('/api', indexRouter);
app.use('/api/users', usersRouter); 
app.use('/api/talk', talkRouter); 

// if not using bin/www from express generator, set port below
// app.listen(3001, () => console.log('Backend on port 4000'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
