const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const adminModel = require('./../models/admin');
const schoolModel = require('./../models/school');

const Op = Sequelize.Op;

const addAdminView = async (req, res, next) => {
  const schools = await schoolModel.findAll({
    where: {
      status: {
        [Op.eq]: '1',
      },
    },
  });

  res.render('superadmin/add-admin', {
    schools,
  });
};

const addAdmin = (req, res, next) => {
  adminModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email address already exists');
        // res.send('NO');
        res.redirect('/superadmin/add-admin');
      } else {
        let password = req.body.personal_number;
        adminModel
          .create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(password, 6),
            schoolId: req.body.schoolId,
          })
          .then((status) => {
            if (status) {
              req.flash('success', 'User has been registered');
              res.redirect('/superadmin/add-admin');
            } else {
              req.flash('error', 'Failed to register user');
              res.redirect('/superadmin/add-admin');
            }
          })
          .catch((err) => {
            res.status(400).json({
              data: err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({
        data: err,
      });
    });
};

const allAdmins = async (req, res) => {
  const admins = await adminModel.findAll({
    include: {
      model: schoolModel,
      attributes: ['name'],
    },
    where: {
      isSuperAdmin: false,
    },
  });

  res.render('superadmin/list-admin', { admins: admins });
};

const editAdmin = async (req, res, next) => {
  const admin_data = await adminModel.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id,
      },
    },
  });

  res.render('superadmin/edit-admin', {
    admin: admin_data,
  });
};

const updateAdmin = (req, res, next) => {
  adminModel
    .update(
      {
        name: req.body.name,
        email: req.body.email,
        schoolId: req.body.schoolId,
      },
      {
        where: {
          id: {
            [Op.eq]: req.params.id,
          },
        },
      }
    )
    .then((status) => {
      if (status) {
        req.flash('success', 'Admin has been updated successfully');
      } else {
        req.flash('error', 'Failed to update admin');
      }
      // res.send('ok');
      res.redirect('/superadmin/edit-admin/' + req.params.id);
    });
};

const deleteAdmin = (req, res, next) => {
  adminModel
    .destroy({
      where: {
        id: {
          [Op.eq]: req.body.admin_id,
        },
      },
    })
    .then((status) => {
      if (status) {
        req.flash('success', 'User deleted successfully');
      } else {
        req.flash('error', 'Failed to delete user');
      }

      res.redirect('/superadmin/list-admin');
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

module.exports = {
  addAdminView,
  addAdmin,
  allAdmins,
  editAdmin,
  updateAdmin,
  deleteAdmin,
};
