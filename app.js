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

mongoose.connect('mongodb://localhost/devnote_db');

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

// app.get('/local/oauth_callback',function(req,res){
//   console.log("in oauth_callback");
//   var client = new Evernote.Client({
//     consumerKey: process.env.EVERNOTE_CONSUMER_KEY,
//     consumerSecret: process.env.EVERNOTE_CONSUMER_SECRET,
//     sandbox: true
//   });
//   client.getAccessToken(req.session.oauthToken, req.session.oauthTokenSecret, req.param('oauth_verifier'), function(error, oauthAccessToken, oauthAccessTokenSecret, results){
//       if(error) {
//         console.log('error');
//         console.log(error);
//         res.redirect('/');
//       } else {
//         User.findById(req.user._id,function(err, user){
//           user.evernote.access_token = oauthAccessToken
//           user.save(function(err){
//             if (err) throw err;
//             res.redirect('/')
//           })
//         })
//       }

//   })
// })

var evernoteRoutes = require('./config/evernoteRoutes');
app.use('/', evernoteRoutes);

var apiRoutes = require('./config/apiRoutes');
app.use('/', apiRoutes);

var userRoutes = require('./config/userRoutes');
app.use('/', userRoutes);

var articleRoutes = require('./config/articleRoutes');
app.use('/', articleRoutes);


// app.post('/api/user/update/:user_id', function(req,res){
//   var updateAttr = {evernote: {username: req.body.username}}
//   User.findById(req.params.user_id, function(err,user){
//     if (err) throw err;

//     user.evernote.username = req.body.username;
//     user.save(function(err){
//       if (err) throw err;
//       res.status(201).json({message: 'successfully updated'})
//     })
//   })
// })

app.get('/article/:article_id',function(req,res){
  Article.findOne({_id: req.params.article_id},function(err, article){
    res.render('showArticle',{article})
  })
})

app.listen(3000)
console.log("Connected to server")