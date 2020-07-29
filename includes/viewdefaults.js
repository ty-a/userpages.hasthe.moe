module.exports = function() {
  return function(req, res, next) {
    res.locals.viewsettings = {};
    res.locals.userobj = req.user;
    res.locals.isLoggedIn= req.isAuthenticated();
    next();
  }
}
