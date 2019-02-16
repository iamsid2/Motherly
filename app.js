var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//database
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var db = mongoose.connection;
//mongo connection
var url = 'mongodb://prabi:prabi6@ds237955.mlab.com:37955/motherly'; //Db name
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true } ,function (err, db) { //a connection with the mongodb is established here.
  if(!err) console.log("Database connected");
});

var server = http.Server(app);
var mongoClient = require("mongodb").MongoClient;
var routes = require('./routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//session
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

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

app.listen(4000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 4000);
});

module.exports = app;
