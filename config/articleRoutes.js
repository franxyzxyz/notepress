var express = require('express');
var articleRouter = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require("passport");
var articleController = require('../controllers/article');

articleRouter.route('/')
  .get(articleController.getAllArticle)

articleRouter.route('/article/:article_id')
  .get(articleController.getOneArticle)



module.exports = articleRouter