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
        req.flash('success', 'School has been created');
        res.redirect('/superadmin/schools/add-school');
      } else {
        req.flash('error', 'Failed to save school');
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
        req.flash('success', 'School has been updated successfully');
      } else {
        req.flash('error', 'Failed to update school');
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
        req.flash('success', 'School deleted successfully');
      } else {
        req.flash('error', 'Failed to delete school');
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
