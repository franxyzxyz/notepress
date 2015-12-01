var EvernoteStrategy = require('passport-evernote').Strategy;
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user');
var gravatar        = require('gravatar');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, callback) {
    User.findOne({'local.email': email}, function(err, user){
      if (err) return callback(err);
      if (user){
        return callback(null, false)
      }else{
        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.encrypt(password);
        newUser.local.gravatar = gravatar.url(email);

        newUser.save(function(err){
          if (err) throw err;
          return callback(null, newUser)
        })

      }
    })
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },function(req, email, password, callback){
    User.findOne({'local.email': email}, function(err, user){
      if (err) return callback(err);
      if (!user) return callback(null, false);

      if (!user.validPassword(password)) return callback(null, false);

      return callback(null, user);
    })
  }))

}