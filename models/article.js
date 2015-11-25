var mongoose = require('mongoose');
var stackList = require('../helper/list').stackList;

// var stackList = ['Node.js','Ruby','HTML','CSS','Rails','MongoDB','Postgres','Neo4J','Others','Javascipt'];

var Article = mongoose.Schema({
  title: { type: String, required: true},
  contentHTML: { type: String },
  tag: [{type: String, enum:stackList}],
  author: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Article', Article);
