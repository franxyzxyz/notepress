var passport = require("passport");
var Article = require("../models/article");

function getAllArticle(req,res){
  res.render('articles/index')
}

function getOneArticle(req,res){
  var article_id = req.params.article_id;
  res.render('articles/show', {article_id})
}

function editArticle(req,res){
  var article_id = req.params.article_id;
  res.render('articles/edit', {article_id})
}

module.exports = {
  getAllArticle:  getAllArticle,
  getOneArticle:  getOneArticle,
  editArticle  :  editArticle
}