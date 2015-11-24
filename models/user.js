var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = mongoose.Schema({
  evernote : {
    id        : String,
    access_token : String,
    username     : {type: String, unique: true},
    // email        : String
  },
  // username: {type: String, required: true}
});


module.exports = mongoose.model('User', User);
