var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = mongoose.Schema({
  evernote : {
    // id        : String,
    access_token : String,
    // later remove username
    // username     : {type: String, unique: true}
    // email        : String
  },
  local:{
    email: {type: String, required: true, unique: true},
    password: String
  }
  // username: {type: String, required: true}
});

User.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', User);
