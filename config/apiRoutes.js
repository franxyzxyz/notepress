var express = require('express');
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require("passport");
var usersController = require('../controllers/api/article');

apiRouter.route('/api/article')
  .post(authenticatedUser,usersController.postArticle)

function authenticatedUser(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = apiRouter