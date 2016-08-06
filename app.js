var express = require('express');
var session = require('express-session');
var path = require('path');
var passport = require('passport');
var config = require('nconf');
var requireTree = require('require-tree')
var configs = requireTree('configs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var winston = require('winston');
var flash    = require('connect-flash');

var app = express();

config.file({'file': '../config.json'});

winston.add(winston.transports.File, { filename: 'logs.log', maxsize: 1048576, zippedArchive: true });

mongoose.connect(config.get('mongoose:connectionString'));
var db = mongoose.connection;

db.on('error', function (err) {
  winston.log('db error', err.message)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'Very-Secret', resave: true, saveUninitialized: true })); // session settings
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

configs.routes(app, passport);
configs.passport(passport);
configs.errorsHandling(app);


module.exports = app;
