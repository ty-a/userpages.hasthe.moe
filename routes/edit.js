const fs = require('fs');

var express = require('express');
var router = express.Router();
var config = require('../config/users.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.flash('danger', 'Please login before editing userpages.');
    res.redirect('/');
    return;
  }

  if(typeof req.query.user != "undefined") {
      // we have user defined, redirect to correct page
      res.redirect('/edit/' + req.query.user);
      return;
  }
  res.render('edit_blank', { title: 'Edit userpages' });
});

router.get('/:user/', function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.flash('danger', 'Please login before editing userpages.');
    res.redirect('/');
    return;
  }

  if(typeof config[req.params.user] == 'undefined') {
    var pages = {};
    res.locals.noPages = true
    res.flash('primary', 'Creating new user');
  }

  res.render('edit', { title: 'Edit userpages', user: req.params.user, pages: config[req.params.user] });

});

router.post('/:user', function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.flash('danger', 'Please login before editing userpages.');
    res.redirect('/');
    return;
  }
  var newUser = {};
  newData = {};
  for(lang in req.body) {
    if(lang == "user")
      continue;

    var holder = req.body[lang];
    if(lang.toLowerCase() == "gamepedia") {
      lang = "Gamepedia"; // ensure we have consistent casing
    }

    newData[lang] = holder;
  }
  console.log(newData);
  console.log(Object.keys(newData).length);

  var didDelete = false;

  if(Object.keys(newData).length == 0) {
    // no fields were provided, so delete it from config
    delete config[req.body.user];
    didDelete = true;

  }
  config[req.body.user] = newData;

  fs.writeFile('./config/users.json', JSON.stringify(config, null, 5), {flag:'w+'}, (err) => {
    if(err) {
      console.error(err);
      req.flash('danger', 'Unable to write new config file. Please contact @tya.');
      res.render('edit', { title: 'Edit userpages', user: req.params.user, pages: config[req.params.user] });
      return;
    }
    if(didDelete) {
      req.flash('success', 'Deleted userpage templates for ' + req.params.user);
    } else {
      req.flash('success', 'Updated userpage templates for ' + req.params.user);
    }

    res.redirect('/');
  });

})

module.exports = router;
