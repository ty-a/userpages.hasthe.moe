var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var sqlite3 = require('sqlite3').verbose();
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var config = require('./config/config.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var editRouter = require('./routes/edit');

var app = express();
var flash = require('flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  store: new SQLiteStore({dir:'./db/', db:'sessions.db'}),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // dev env is http
    maxAge: 1000 * 60 * 60 * 24 * 7 // one week
  }
}));

let db = new sqlite3.Database('./db/db.sqlite3', function(err) {
  if(err) {
    console.log("Unable to open database. Please check file permissions.");
    console.error(err);
    process.exit(1);
  }
});

var dbFunctions = require('./includes/db.js')(db);
//dbFunctions.createDB();

require('./includes/passport.js')(passport, dbFunctions);
//dbFunctions.createUser(null, 'Ty', 'password', function(resp) {
//  console.log(resp);
//});

var loginRouter = require('./routes/login')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var viewdefault = require('./includes/viewdefaults.js');
app.use(viewdefault());

// if we are posting, ensure we have an API key
//@TODO: actually implement api key feature
app.use(function(req, res, next) {
  if(req.method == "POST") {
    if(typeof req.body.apikey == "undefined") {
      //next(createError(403));
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/edit', editRouter);
app.use('/login', loginRouter);

app.use('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'Logged out successfully');
  res.redirect('/');
});
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
