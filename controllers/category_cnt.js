const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const adminModel = require('./../models/admin');
const Op = Sequelize.Op;

const addCategory = async (req, res) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  categoryModel
    .findOne({
      where: {
        name: req.body.name,
        schoolId: admin.schoolId,
      },
    })

    .then((data) => {
      if (data) {
        req.flash('error', 'Kategoria ekziston');
        res.redirect('/admin/categories/add-category');
      } else {
        categoryModel
          .create({
            name: req.body.name,
            status: req.body.status,
            schoolId: admin.schoolId,
          })
          .then((category) => {
            if (category) {
              req.flash('success', 'Kategoria u krijua me sukses');
              res.redirect('/admin/categories/add-category');
            } else {
              req.flash('error', 'Krijimi i kategorisë dështoi');

              res.redirect('/admin/categories/add-category');
            }
          })
          .catch((err) => {
            res.status(400).json({
              status: 0,
              data: err,
            });
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

const allCategories = async (req, res) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const allCategories = await categoryModel.findAll({
    where: {
      schoolId: admin.schoolId,
    },
  });
  res.render('admin/list-category', { categories: allCategories });
};

const editCategory = async (req, res, next) => {
  const category_data = await categoryModel.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.render('admin/edit-category', { category: category_data });
};

const updateCategory = (req, res, next) => {
  categoryModel
    .findOne({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.ne]: req.params.id,
            },
          },
          {
            name: {
              [Op.eq]: req.body.name,
            },
          },
        ],
      },
    })
    .then((category) => {
      if (category) {
        req.flash('error', 'Kategoria ekziston!');
        res.redirect('/admin/categories/edit-category/' + req.params.id);
      } else {
        categoryModel
          .update(
            {
              name: req.body.name,
              status: req.body.status,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          )
          .then((updatedCategory) => {
            if (updatedCategory) {
              req.flash('success', 'Kategoria u modifikua me sukses!');
            } else {
              req.flash('error', 'Modifikimi i kategorisë dështoi!');
            }
            res.redirect('/admin/categories/edit-category/' + req.params.id);
          })
          .catch((err) => {
            res.status(400).json({
              status: 0,
              data: err,
            });
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

const deleteCategory = (req, res, next) => {
  categoryModel
    .findOne({
      where: {
        id: {
          [Op.eq]: req.body.category_id,
        },
      },
    })
    .then((category) => {
      if (category) {
        categoryModel
          .destroy({
            where: {
              id: {
                [Op.eq]: req.body.category_id,
              },
            },
          })
          .then((status) => {
            if (status) {
              req.flash('success', 'Kategoria u fshi!');
            } else {
              req.flash('error', 'Fshirja e kategorisë dështoi!');
            }

            res.redirect('/admin/categories/list-category');
          })
          .catch((err) => {
            res.status(400).json({
              status: 0,
              data: err,
            });
          });
      } else {
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: 0,
        data: err,
      });
    });
};

module.exports = {
  addCategory,
  allCategories,
  editCategory,
  updateCategory,
  deleteCategory,
};
