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

var Article = require('./models/article');
var Comment = require('./models/comment');

// app.get('/', function(req, res){
//   // res.render('index', {user: req.user})
//   // res.render('layout', {user: req.user});
//   res.render('index')
// });

app.get('/',function(req,res){
  res.render('index')
})

app.get('/article/:article_id',function(req,res){
  var article_id = req.params.article_id;
  res.render('article', {article_id})
})

app.get('/api/articles',function(req,res){
  Article.find({}).populate('author').exec(function(err,articles){

  // Article.find({},function(err,articles){
    res.status(200).json({articles})
  })
})

app.get('/api/article/:article_id',function(req,res){
  Article.findOne({_id: req.params.article_id},function(err,article){
    if (err) throw err;
    Comment.find({article: req.params.article_id}).populate('by_user').exec(function(err,comments){
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

app.get('/test-content/:id',function(req,res){
  User.findOne({'evernote.id': req.params.id},function(err,user){
    var client = new Evernote.Client({token: user.evernote.access_token});

    var noteStore = client.getNoteStore();

    // notes = noteStore.getNote(function(err,notes){
    //   console.log(notes)
    //   // res.render('show',{notes})
    // })
    noteStore.listNotebooks(function(err, notebooks) {
      var filter = new Evernote.NoteFilter();
      resultSpec = new Evernote.NotesMetadataResultSpec();
      resultSpec.includeTitle=true;

      filter.notebookGuid = notebooks[0].guid;
      noteStore.findNotesMetadata(filter, 0, 100, resultSpec, function(err, notesMeta){
        console.log(notesMeta)

        res.render('show',{notesMeta})
      })
    });
  });
});

app.get('/guid/:guid',function(req,res){
  var guid = req.params.guid
  res.render('contentPage',{guid})
})

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

app.post('/api/comment',function(req,res){
  var newComment = new Comment();
  newComment.content = req.body.comment.content;
  // newComment.response =
  //
  // by_user [PLEASE CHANGE FOR LATER ON]
  newComment.by_user = '5653d8ec890ca53b0664712c';
  newComment.article = req.body.comment.article;

  newComment.save(function(err, comment){
    if (err) throw err;

    res.status(200).json({ comment })
  })
})

app.post('/api/article',function(req,res){
  // console.log(req.body.article)
  var newArticle = new Article();
  newArticle.title = "TEST";
  newArticle.contentHTML = req.body.article;
  newArticle.tag = ['Ruby'];
  newArticle.author = req.user._id
  console.log(newArticle)
  newArticle.save(function(err,article){
    if (err) throw err;

    res.status(200).json({message: 'successfully posted', redirect_id: req.user.evernote.id})
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

app.listen(3000)
console.log("Connected to server")