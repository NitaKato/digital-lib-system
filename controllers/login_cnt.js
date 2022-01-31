const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const adminModel = require('../models/admin');

const Op = Sequelize.Op;

const superAdminRegister = (req, res, next) => {
  adminModel
    .create({
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      isSuperAdmin: true,
      password: bcrypt.hashSync('111222', 10),
    })
    .then((data) => {
      if (data) {
        res.json({
          status: 1,
          message: 'Admin created successfully',
        });
      } else {
        res.json({
          status: 0,
          message: 'Failed to create admin',
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

const login = (req, res, next) => {
  adminModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.userId = user.id;
            req.session.superAdmin = user.isSuperAdmin;
            if (user.isSuperAdmin) {
              return res.redirect('/superadmin/homepage');
            }
            res.redirect('/admin');
          } else {
            req.flash('error', 'Invalid login details');
            res.redirect('/auth/login');
          }
        });
      } else {
        req.flash('error', 'User not found');
        res.redirect('/auth/login');
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      res.redirect('/admin');
    }
    console.log(req.session);
    res.redirect('/auth/login');
  });
};

module.exports = { login, superAdminRegister, logout };
