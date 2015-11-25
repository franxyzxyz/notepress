var passport = require("passport");
var Evernote = require('evernote').Evernote;

function getSignup(req,res){
  res.render('users/signup')
}

function getLogin(req,res){
  var callbackURL = req.query.base
  res.render('users/login',{callbackURL})
}

function logout(req,res){
  req.logout();
  res.redirect("/")
}

function postLogin(req,res){
  var loginStrategy = passport.authenticate('local-login', {
    successRedirect : req.query.base,
    failureRedirect : '/local/login',
    failureFlash : true
  });
  return loginStrategy(req,res);
}

function getUserDashboard(req,res){
  var userId = req.params.user_id
  res.render('user_dashboard',{userId})
}

module.exports = {
  getSignup:         getSignup,
  getLogin:          getLogin,
  postLogin:         postLogin,
  logout:            logout,
  getUserDashboard : getUserDashboard
}