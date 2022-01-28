const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const adminModel = require('../models/admin');

const Op = Sequelize.Op;

const adminLogin = (req, res, next) => {
  adminModel
    .findOne({
      where: {
        email: {
          [Op.eq]: req.body.email,
        },
      },
    })
    .then((user) => {
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (error, result) {
            if (result) {
              //user has data
              req.session.isLoggedIn = true;
              req.session.userId = user.id;
              console.log(req.session);
              res.redirect('/admin');
            } else {
              req.flash('error', 'Invalid login details');
              res.redirect('/admin/login');
            }
          }
        );
      } else {
        // we have no data
        req.flash('error', 'User not found');
        res.redirect('/admin/login');
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

const adminRegister = (req, res, next) => {
  adminModel
    .create({
      name: 'Online Web Tutor',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('123456', 10),
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

const getAdminLayout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      res.redirect('/admin');
    }
    console.log(req.session);
    res.redirect('/admin/login');
  });
};

module.exports = { adminLogin, adminRegister, getAdminLayout };
