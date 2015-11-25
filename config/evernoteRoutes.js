var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require("passport");
var usersController = require('../controllers/evernotes');


router.route('/getNotesList')
  .get(authenticatedUser, usersController.getNotesList);

router.route('/guid/:guid')
  .get(authenticatedUser, usersController.getNoteByGuid)

function authenticatedUser(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;
