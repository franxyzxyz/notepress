var passport = require("passport");
var Article = require("../../models/article");

function postArticle(req,res){
  var newArticle = new Article();
  newArticle.title = req.body.title;
  newArticle.contentHTML = req.body.article;
  newArticle.tag = [req.body.tag];
  newArticle.author = req.user._id
  newArticle.save(function(err,article){
    if (err) throw err;

    res.status(200).json({message: 'successfully posted', redirect_id: req.user.evernote.id})
  })
}

module.exports = {
  postArticle: postArticle
}