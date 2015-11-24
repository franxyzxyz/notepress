var mongoose = require('mongoose');

var Comment = mongoose.Schema({
  content: {type:String, required: true},
  // response: {type: Boolean, required: true},
  article: {type: mongoose.Schema.ObjectId, ref: 'Article'},
  by_user: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Comment', Comment);