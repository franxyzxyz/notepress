var EvernoteStrategy = require('passport-evernote').Strategy;
var User = require('../models/user');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      // console.log('deserializing user:',user);
      done(err, user);
    });
  });

  passport.use('evernote-signup', new EvernoteStrategy({
    requestTokenURL: 'https://sandbox.evernote.com/oauth',
    accessTokenURL: 'https://sandbox.evernote.com/oauth',
    userAuthorizationURL: 'https://sandbox.evernote.com/OAuth.action',
    consumerKey : process.env.EVERNOTE_CONSUMER_KEY,
    consumerSecret : process.env.EVERNOTE_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/evernote/callback"
  }, function(token, tokenSecret, profile, done){
    User.findOne({'evernote.id': profile.id}, function(err, user){
      if (err) return done(err);
      if (user){
        return done(null, user);
      }else{
        console.log("token: " + token);
        console.log("tokenSecret: " + tokenSecret);
        console.log(profile);
        var newUser = new User();
        newUser.evernote.id = profile.id;
        newUser.evernote.access_token = token;
        newUser.save(function(err){
          if (err) throw err;

          return done(null, newUser)
        })
      };
    })
  }
  ));
}