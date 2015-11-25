var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user');

module.exports = function(passport){
    passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    }, function(req, email, password, callback) {
      User.findOne({'local.email': email}, function(err, user){
        if (err) return callback(err);
        if (user){
          return callback(null, false, req.flash('signUpMessage', 'This email is already used.'))
        }else{
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.passport = newUser.encrypt(password);

          newUser.save(function(err){
            if (err) throw err;
            return callback(null, newUser)
          })

        }
      })
    }));

}