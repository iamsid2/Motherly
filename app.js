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

const APIAI_TOKEN = "e9804f5b4bcd4c94b71f0d277dfdc7ee";
const APIAI_SESSION_ID = "s260997s";

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
// Provide access to node_modules folder
app.use('/scripts', express.static(path.join(__dirname,'node_modules')));

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


const ser = app.listen(3030,'0.0.0.0', function() {
    console.log('Server Listening to port 3030');
});

const io = require('socket.io')(ser);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});

module.exports = app;
