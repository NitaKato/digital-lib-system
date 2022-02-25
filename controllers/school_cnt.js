const Sequelize = require('sequelize');

const schoolModel = require('./../models/school');

const Op = Sequelize.Op;

const addSchool = (req, res, next) => {
  schoolModel
    .create({
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      status: req.body.status,
    })
    .then((status) => {
      if (status) {
        req.flash('success', 'Shkolla u krijua me sukses!');
        res.redirect('/superadmin/schools/add-school');
      } else {
        req.flash('error', 'Krijimi i shkollës dështoi');
        res.redirect('/superadmin/schools/add-school');
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

const allSchools = async (req, res) => {
  const allSchools = await schoolModel.findAll();
  res.render('superadmin/list-school', { schools: allSchools });
};

const getUpdateSchool = async (req, res, next) => {
  const school_data = await schoolModel.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id,
      },
    },
  });

  res.render('superadmin/edit-school', {
    school: school_data,
  });
};

const updateSchool = (req, res, next) => {
  schoolModel
    .update(
      {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
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
        req.flash('success', 'Shkolla u modifikua me sukses!');
      } else {
        req.flash('error', 'Modifikimi i shkollës dështoi!');
      }

      res.redirect('/superadmin/schools/edit-school/' + req.params.id);
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

const deleteSchool = (req, res, next) => {
  schoolModel
    .destroy({
      where: {
        id: {
          [Op.eq]: req.body.school_id,
        },
      },
    })
    .then((status) => {
      if (status) {
        req.flash('success', 'Shkolla u fshi me sukses!');
      } else {
        req.flash('error', 'Fshirja e shkollës dështoi!');
      }

      res.redirect('/superadmin/schools/list-school');
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

module.exports = {
  addSchool,
  allSchools,
  getUpdateSchool,
  updateSchool,
  deleteSchool,
};
