const isLoggedIn = (req, res, next) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@', req.session);
  req.session.isLoggedIn ? next() : res.redirect('/auth/login');
};
// res.send('ERROR PAGE! YOU DONT HAVE ACCESS.You are Super Admin');

const isSuperAdmin = (req, res, next) => {
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^@@@@@', req.ression);
  req.session.isSuperAdmin ? next() : res.redirect('/error');
};

const isAdmin = (req, res, next) => {
  req.session.isSuperAdmin ? res.redirect('/error') : next();
};

module.exports = { isLoggedIn, isSuperAdmin, isAdmin };
