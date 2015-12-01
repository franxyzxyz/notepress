var mongoose = require('mongoose');
var stackList = require('../helper/list').stackList;

var Article = mongoose.Schema({
  title: { type: String, required: true},
  subtitle: { type: String},
  contentHTML: { type: String },
  tag: [{type: String, enum:stackList}],
  author: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Article', Article);
