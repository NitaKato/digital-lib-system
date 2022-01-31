const Sequelize = require('sequelize');

const userModel = require('./../models/user');

const Op = Sequelize.Op;

const addUser = (req, res, next) => {
  userModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email address already exists');
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
          })
          .then((status) => {
            if (status) {
              req.flash('success', 'User has been created');
              res.redirect('/admin/users/add-user');
            } else {
              req.flash('error', 'Failed to save users');
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
  const allUsers = await userModel.findAll();
  res.render('admin/list-user', { users: allUsers });
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
        req.flash('success', 'User has been updated successfully');
      } else {
        req.flash('error', 'Failed to update user');
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
        req.flash('success', 'User deleted successfully');
      } else {
        req.flash('error', 'Failed to delete user');
      }

      res.redirect('/admin/users/list-user');
    });
};

module.exports = { addUser, allUsers, editUser, updateUser, deleteUser };
