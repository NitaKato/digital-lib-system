const isLoggedIn = (req, res, next) => {
  req.session.isLoggedIn ? next() : res.redirect('/auth/login');
};

const isSuperAdmin = (req, res, next) => {
  req.session.superAdmin ? next() : res.redirect('/error');
};

const isAdmin = (req, res, next) => {
  req.session.superAdmin ? res.redirect('/error') : next();
};

module.exports = { isLoggedIn, isSuperAdmin, isAdmin };
