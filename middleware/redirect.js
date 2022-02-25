const redirectHome = function (req, res, next) {
  if (req.session.userId) {
    if (req.session.superAdmin) {
      return res.redirect('/superadmin/homepage');
    }
    res.redirect('/admin');
  } else {
    next();
  }
};

const redirectLogin = function (req, res, next) {
  if (!req.session.userId) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

module.exports = {
  redirectHome,
  redirectLogin,
};
