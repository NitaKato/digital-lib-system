const Sequelize = require('sequelize');

const userModel = require('./../models/user');
const adminModel = require('./../models/admin');

const Op = Sequelize.Op;

const addUser = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  userModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email adresa ekziston!');
        res.redirect('/admin/users/add-user');
      } else {
        userModel
          .create({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            gender: req.body.dd_gender,
            address: req.body.address,
            status: req.body.status,
            schoolId: admin.schoolId,
          })
          .then((status) => {
            if (status) {
              req.flash('success', 'Nxënësi u krijua me sukses!');
              res.redirect('/admin/users/add-user');
            } else {
              req.flash('error', 'Krijimi i nxënësit dështoi!');
              res.redirect('/admin/users/add-user');
            }
          });
      }
    })
    .catch((err) => {
      res.status(400).json({
        data: err,
      });
    });
};

const allUsers = async (req, res) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const users = await userModel.findAll({
    where: {
      schoolId: admin.schoolId,
    },
  });

  res.render('admin/list-user', { users: users });
};

const editUser = async (req, res, next) => {
  const user_data = await userModel.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id,
      },
    },
  });

  res.render('admin/edit-user', {
    user: user_data,
  });
};

const updateUser = (req, res, next) => {
  userModel
    .update(
      {
        name: req.body.name,
        mobile: req.body.mobile,
        gender: req.body.dd_gender,
        address: req.body.address,
        status: req.body.status,
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
        req.flash('success', 'Nxënësi u modifikua me sukses!');
      } else {
        req.flash('error', 'Modifikimi i nxënësit dështoi!');
      }

      res.redirect('/admin/users/edit-user/' + req.params.id);
    });
};

const deleteUser = (req, res, next) => {
  userModel
    .destroy({
      where: {
        id: {
          [Op.eq]: req.body.user_id,
        },
      },
    })
    .then((status) => {
      if (status) {
        req.flash('success', 'Nxënësi u fshi!');
      } else {
        req.flash('error', 'Fshirja e nxënësit dështoi!');
      }

      res.redirect('/admin/users/list-user');
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

module.exports = { addUser, allUsers, editUser, updateUser, deleteUser };
