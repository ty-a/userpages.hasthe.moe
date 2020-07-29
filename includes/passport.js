var LocalStrategy = require('passport-local').Strategy;
module.exports = function(passport, dbFunctions) {
  passport.use('local-login', new LocalStrategy({
      session: true,
      passReqToCallback: true
    },
    function(req, username, password, done) {
      dbFunctions.loginUser(req, username, password, done);
    }
  ));

  passport.serializeUser(function(user, done) {
    return done(null, user.userId);
  });

  passport.deserializeUser(function(userId, done) {
    dbFunctions.getUserFromId(userId, done);
  });

  passport.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    res.redirect('/login');
  };
}
