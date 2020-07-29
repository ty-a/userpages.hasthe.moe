var express = require('express');
var router = express.Router();
var users = require('../config/users.json');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.flash('danger', 'Please login.');
    res.redirect('/');
    return;
  }
  res.render('users', { title: 'Userpages', data: users });
});

module.exports = router;
