const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const Op = Sequelize.Op;

const addCategory = (req, res) => {
  categoryModel
    .findOne({
      where: {
        name: req.body.name,
      },
    })
    .then((data) => {
      if (data) {
        //exists
        req.flash('error', 'Category already exists');
        res.redirect('/admin/add-category');
      } else {
        // doesn't exists
        categoryModel
          .create({
            name: req.body.name,
            status: req.body.status,
          })
          .then((category) => {
            if (category) {
              req.flash('success', 'Category created successfully');
              res.redirect('/admin/add-category');
            } else {
              req.flash('error', 'Failed to create category');

              res.redirect('/admin/add-category');
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
  const allCategories = await categoryModel.findAll();
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
        // category already exists
        req.flash('error', 'Category already exists!');
        res.redirect('/admin/edit-category/' + req.params.id);
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
              req.flash('success', 'Category updated successfully!');
            } else {
              req.flash('error', 'Failed to update category!');
            }
            res.redirect('/admin/edit-category/' + req.params.id);
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
        // we have data on the basis of the given id
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
              // deleted
              req.flash('success', 'Category has been deleted successfully');
            } else {
              // not deleted
              req.flash('error', 'Failed to delete category');
            }

            res.redirect('/admin/list-category');
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
