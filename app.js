var express = require('express');
var app = express();
var mongoose     = require('mongoose');
var passport     = require('passport');
var Evernote = require('evernote').Evernote;
var morgan       = require('morgan');
var ejsLayouts   = require("express-ejs-layouts");
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var enml = require('enml-js');

require('dotenv').load();
app.use(cookieParser());
app.use(bodyParser());

mongoose.connect('mongodb://localhost/devnote_db');

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set("views","./views");
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'devnote-evernote-passbook'
 }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
require('./config/passport')(passport);

app.use(function (req, res, next) {
  global.user = req.user;
  next()
});

var Article = require('./models/article');
var Comment = require('./models/comment');

// app.get('/', function(req, res){
//   // res.render('index', {user: req.user})
//   // res.render('layout', {user: req.user});
//   res.render('index')
// });

app.get('/',function(req,res){
  res.render('articles/index')
})

app.get('/article/:article_id',function(req,res){
  var article_id = req.params.article_id;
  res.render('articles/show', {article_id})
})

/// API : GET ALL ARTICLES
app.get('/api/articles',function(req,res){
  Article.find({}).populate('author').exec(function(err,articles){
    res.status(200).json({articles})
  })
})
/// API: GET ONE ARTICLE
app.get('/api/article/:article_id',function(req,res){
  Article.findOne({_id: req.params.article_id},function(err,article){
    if (err) throw err;
    Comment.find({article: req.params.article_id}).populate('by_user').sort({_id:-1}).exec(function(err,comments){
      if (err) throw err;
      res.status(200).json({article: article, time: article._id.getTimestamp(), comments: comments})
    })
    // Comment.find({article: req.params.article_id},function(err,comments){
    // })
  })
})

app.get('/signup',function(req,res){
  res.render('signup')
})

app.get('/auth/evernote', passport.authenticate('evernote-signup'));

app.post('/local/signup', passport.authenticate('local-signup',{
  failureRedirect : '/local/signup',
  failureFlash : true
}),function(req,res){
  var userId = req.user._id

  var client = new Evernote.Client({
    consumerKey: process.env.EVERNOTE_CONSUMER_KEY,
    consumerSecret: process.env.EVERNOTE_CONSUMER_SECRET,
    sandbox: true
  });

  var callbackURL = 'http://localhost:3000/local/oauth_callback';
  client.getRequestToken(callbackURL, function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      console.log('err')
      req.session.error = JSON.stringify(error);
      res.redirect('/');
    }else{
      console.log("success request token")
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;

      res.redirect(client.getAuthorizeUrl(oauthToken));
    }
  });
});

app.get('/local/oauth_callback',function(req,res){
  console.log("in oauth_callback");
  var client = new Evernote.Client({
    consumerKey: process.env.EVERNOTE_CONSUMER_KEY,
    consumerSecret: process.env.EVERNOTE_CONSUMER_SECRET,
    sandbox: true
  });
  client.getAccessToken(req.session.oauthToken, req.session.oauthTokenSecret, req.param('oauth_verifier'), function(error, oauthAccessToken, oauthAccessTokenSecret, results){
      if(error) {
        console.log('error');
        console.log(error);
        res.redirect('/');
      } else {
        User.findById(req.user._id,function(err, user){
          user.evernote.access_token = oauthAccessToken
          user.save(function(err){
            if (err) throw err;
            res.redirect('/')
          })
        })
      }

  })
})

app.get('/local/login',function(req,res){
  res.render('users/login')
})

app.post('/local/login', passport.authenticate('local-login', {
  failureRedirect : '/login',
  failureFlash : true
}),function(req,res){
  console.log(req.user)
  res.redirect('/')
});

app.get('/local/signup',function(req,res){
  res.render('users/signup')
})

app.get('/auth/evernote/callback', passport.authenticate('evernote-signup',{ failureRedirect: '/'}),function(req,res){
  console.log(req.session)
  // sucessful authentication, redirect home
  // res.redirect('/')
  var userId = req.user._id

  if (req.user.evernote.username){
    res.redirect('/')
  }else{
    res.render('signup',{userId})
  }
})

app.get('/auth/evernote/callback', passport.authenticate('evernote-signup',{ failureRedirect: '/'}),function(req,res){
  req.session.cookie.expires = new Date(Date.now() + 3600000)
  console.log(req.session)
  // sucessful authentication, redirect home
  // res.redirect('/')
  var userId = req.user._id
  if (req.user.evernote.username){
    res.redirect('/')
  }else{
    res.render('signup',{userId})
  }
})

app.get('/test-dev',function(req,res){
  var devToken = process.env.EVERNOTE_DEV_TOKEN;
  var client = new Evernote.Client({token: devToken});

  var noteStore = client.getNoteStore();

  noteStore.listNotebooks(function(err, notebooks) {
    console.log(notebooks[0])
    // for (var i in notebooks) {
    //   console.log("Notebook: " + notebooks[i].name);
    // }
  })
})

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/")
})

var User = require('./models/user');

var routes = require('./config/routes');
app.use('/', routes);

var apiRoutes = require('./config/apiRoutes');
app.use('/', apiRoutes);


app.post('/article',function(req,res){
  console.log(req.body)
})

app.get('/user/:user_id',function(req,res){
  var userId = req.params.user_id
  res.render('user_dashboard',{userId})
})

app.get('/api/user/:user_id',function(req,res){
  User.findById(req.params.user_id,function(err,user){
    Article.find({author:req.params.user_id},function(err,articles){
      res.status(200).json({articles: articles, user_id: req.params.user_id, user: user})
    })
  })
})

app.post('/api/user/update/:user_id', function(req,res){
  var updateAttr = {evernote: {username: req.body.username}}
  User.findById(req.params.user_id, function(err,user){
    if (err) throw err;

    user.evernote.username = req.body.username;
    user.save(function(err){
      if (err) throw err;
      res.status(201).json({message: 'successfully updated'})
    })
  })
})

/// API: Post Comment
app.post('/api/comment',function(req,res){
  var newComment = new Comment();
  newComment.content = req.body.comment.content;
  // newComment.response =
  //
  // by_user [PLEASE CHANGE FOR LATER ON]
  newComment.by_user = '5653d8ec890ca53b0664712c';
  newComment.article = req.body.comment.article;

  User.findOne({_id: newComment.by_user},function(err,user){
    if (err) throw err;

    newComment.save(function(err, comment){
      if (err) throw err;

      res.status(200).json({ comment: comment, user: user })
    })
  })
})

app.get('/article/:article_id',function(req,res){
  Article.findOne({_id: req.params.article_id},function(err, article){
    res.render('showArticle',{article})
  })
})

app.get('/api/guid/:guid',function(req,res){
  // req.evernote.access_token
  // User.findOne({'evernote.id': req.params.id},function(err,user){
    var client = new Evernote.Client({token: req.user.evernote.access_token});
    var noteStore = client.getNoteStore();

    noteStore.getNoteContent(req.params.guid,function(err,note){
      // console.log(note)
      // console.log(enml.HTMLOfENML(note))
      var noteHtml = enml.HTMLOfENML(note)
      // res.render('contentPage',{noteHtml})
      res.status(200).json({noteHtml})
    })
  // // })
})

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/')
})


app.listen(3000)
console.log("Connected to server")