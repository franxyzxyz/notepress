var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var passport       = require('passport');
var Evernote       = require('evernote').Evernote;
var morgan         = require('morgan');
var ejsLayouts     = require("express-ejs-layouts");
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');
var connect        = require('connect')
var methodOverride = require('method-override')
var enml           = require('enml-js');

require('dotenv').load();
app.use(cookieParser());
app.use(bodyParser());

var mongoURI = process.env.MONGOLAB_URI;
mongoose.connect(mongoURI);

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set("views","./views");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))

app.use(session({ secret: 'devnote-evernote-passbook'
 }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
require('./config/passport')(passport);

app.use(function (req, res, next) {
  global.user = req.user;
  global.base = req.originalUrl;
  global.stackList = require('./helper/list').stackList;
  next()
});

var Article = require('./models/article');
var Comment = require('./models/comment');
var User = require('./models/user');

var evernoteRoutes = require('./config/evernoteRoutes');
app.use('/', evernoteRoutes);

var apiRoutes = require('./config/apiRoutes');
app.use('/', apiRoutes);

var userRoutes = require('./config/userRoutes');
app.use('/', userRoutes);

var articleRoutes = require('./config/articleRoutes');
app.use('/', articleRoutes);

app.listen(process.env.PORT)
console.log("Connected to server")