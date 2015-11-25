var express = require('express');
var userRouter = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require("passport");
var userController = require('../controllers/user');
var Evernote = require('evernote').Evernote;
var User = require('../models/user');

userRouter.route('/logout')
  .get(userController.logout)

userRouter.route('/user/:user_id')
  .get(userController.getUserDashboard)

userRouter.route('/local/signup')
  .get(userController.getSignup)

userRouter.route('/local/login')
  .get(userController.getLogin)
  .post(userController.postLogin)

userRouter.post('/local/signup', passport.authenticate('local-signup',{
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

userRouter.get('/local/oauth_callback',function(req,res){
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

function authenticatedUser(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = userRouter