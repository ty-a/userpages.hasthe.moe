var express = require('express');
var router = express.Router();
var users = require('../config/users.json');
var config = require('../config/config.json');
var tymw = require('tynodemw');

tymw.setUserInfo(config.username, config.password);

let urlRegex = /(https?:\/\/[\w\d-]*\.(fandom\.com|wikia\.org|gamepedia\.com))\/(.*\/|)(f|index|wiki)/;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"status": false, "reason":"must be POST'd"});
});

router.post('/create', function(req, res, next) {

  if(typeof req.body.user == 'undefined' || typeof req.body.url == 'undefined'
    || typeof req.body.apikey == 'undefined') {
    res.status(400);
    res.json({status: false, reason:"missing parameter(s)"});
    return;
  }

  if(typeof users[req.body.user] == 'undefined') {
    res.status(200);
    res.json({status:false, reason: "not a followed user"});
    return;
  }

  if(!req.body.url.includes(".fandom.com") && !req.body.url.includes(".wikia.org") && !req.body.url.includes(".gamepedia.com")) {
    res.status(400);
    res.json({status: false, reason: "invalid URL"});
    return;
  }

  if(req.body.apikey != config['apikey']) {
    res.status(403);
    res.json({status:false, reason: "invalid api key"});
    return;
  }

  // ensure url is the base url
  var matches = urlRegex.exec(req.body.url);
  // 0 is
  // [
  // 0 'https://riverdale.fandom.com/fr/f',
  // 1 'https://riverdale.fandom.com',
  // 2 'fandom.com',
  // 3 'fr/',
  // 4 'f',

  var url = matches[1] + "/" + matches[3];
  var lang;
  if(matches[3] == "") {
    lang = "en";
  } else {
    lang = matches[3].replace("\/", "");
  }

  // Gamepedia is considered a language by the bot, currently don't support different languages
  if(url.includes(".gamepedia.com")) {
    lang = "Gamepedia";
  }

  tymw.logIn(force=false, skip=true).then(function(resp) {
    tymw.setApiLink(url + "api.php");

    tymw.getPageContent("User:" + req.body.user).then(function(resp) {
      if(resp != "") {
        res.json({status:false, reason: "userpage already exists"});
        return;
      }
      var content;
      if(users[req.body.user].hasOwnProperty(lang)) {
        // we have a template in the wiki's language
        content = users[req.body.user][lang];
      } else if(users[req.body.user].hasOwnProperty('en')) {
        // backup language is english
        content = users[req.body.user]['en'];

        // Ensure we don't try to use Fandom templates on Gamepedia
        if(lang == "Gamepedia") {
          res.json({status:false, reason:'Gamepedia Wiki, but no Gamepedia template.'});
          return;
        }

      } else {
        console.error('no english template for ' + req.body.user);
        res.json({status:false, reason:'no English template fallback'});
        return;
      }
      tymw.edit("User:" + req.body.user, content, "Creating userpage for " + req.body.user)
        .then(function(resp) {
          if(typeof resp.error == 'undefined') {
            res.json({status:true, reason:"page created"});
          } else {
            res.json({status: false, reason:resp.error.code});
          }

        }).catch(function(err) {
          // edit promise was rejected
          console.log("1");
          console.error(err);
          res.json({status: false, reason: "[create] edit promise rejected"});
          return;
        })
    }).catch(function(err) {
      // get page content promise rejected
      console.log("2");
      console.error(err);
      res.json({status: false, reason: "[create] get page contents promise rejected"});
      return;
    });
  }).catch(function(err) {
    // login promise rejected
    console.log("[create] login promise rejected");
    console.error(err);
    res.json({status: false, reason: "[create] login promise rejected; check credentials"});
    return;
  });

});

module.exports = router;
