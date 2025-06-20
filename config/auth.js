module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, continue to the requested page
  }
  res.redirect('/auth/login'); // Redirect to login if not authenticated
};
