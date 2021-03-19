const withAuth = (req, res, next) => {
    // if you're not logged in, you are redirected to the login page
    if (!req.session.logged_in) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;