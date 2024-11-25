const signedIn = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/auth');
  };
  
  module.exports = signedIn;