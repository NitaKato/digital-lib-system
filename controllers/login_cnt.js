const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const adminModel = require('../models/admin');

const superAdminRegister = (req, res, next) => {
  adminModel
    .findOne({
      where: {
        isSuperAdmin: true,
      },
    })
    .then((data) => {
      if (data) {
        res.redirect('/auth/login');
      } else {
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
                message: 'Admin u krijua me sukses',
              });
            } else {
              res.json({
                status: 0,
                message: 'Dështoi',
              });
            }
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
            req.flash('error', 'Email ose fjalëkalimi nuk është i saktë.');
            res.redirect('/auth/login');
          }
        });
      } else {
        req.flash('error', 'Nuk u gjet përdorues');
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
