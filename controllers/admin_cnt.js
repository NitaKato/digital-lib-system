const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');

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

const addAdmin = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const superadmin = await adminModel.findOne({
    where: {
      id: currentUserId,
      isSuperAdmin: true,
    },
  });

  adminModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email adresa ekziston!');
        res.redirect('/superadmin/add-admin');
      } else {
        let password = crypto.randomBytes(4).toString('hex');
        console.log(password);
        adminModel
          .create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            phone_no: req.body.phone_no,
            password: bcrypt.hashSync(password, 6),
            schoolId: req.body.schoolId,
          })
          .then((status) => {
            if (status) {
              // send password to email
              const message = `<h4>Ju sapo u regjistruat në platformën digjitale "Bibliotekat e shkollave të qytetit Lipjan".</h4> <p> Username i juaj është: ${status.email}</p> <p>Fjalëkalimi i juaj është ${password} </p>Ju sugjerojmë të ndryshoni fjalëkalimin.
              <p>Vizitoni webfaqen dhe përdorni informatat e juaja që të kyqeni. </p>.
              <p> Nëse mendoni se keni pranuar këtë email gabim, ju lutem kontaktoni me: ${superadmin.email}</p> `;

              try {
                sendEmail({
                  from: 'admin@gmail.com',
                  to: status.email,
                  subject:
                    'Regjistrimi në Bibliotekat e Shkollave të Qytetit Lipjan',
                  html: message,
                });
              } catch (err) {
                req.flash('error', 'Dërgimi i email dështoi!');
                res.redirect('/superadmin/add-admin');
              }
              // finish email
              req.flash('success', 'Admin u regjistrua me sukses!');
              res.redirect('/superadmin/add-admin');
            } else {
              req.flash('error', 'Regjistrimi i Admin dështoi!');
              res.redirect('/superadmin/add-admin');
            }
          })
          .catch((err) => {
            res.status(400).json({
              data: err.message,
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
        surname: req.body.surname,
        phone_no: req.body.phone_no,
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
        req.flash('success', 'Admin u modifikua me sukses!');
      } else {
        req.flash('error', 'Modifikimi i Admin dështoi!');
      }

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
        req.flash('success', 'Admin u fshi me sukses!');
      } else {
        req.flash('error', 'Fshirja e Admin dështoi');
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
