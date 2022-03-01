const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Book = require('./../models/book');
const User = require('./../models/user');
const Category = require('./../models/category');

const IssueBook = sequelize.define('issueBook', {
  days_issued: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  issued_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  is_returned: {
    type: Sequelize.ENUM('1', '0'),
    defaultValue: '0',
  },
  returned_date: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM('1', '0'),
    defaultValue: '1',
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

Book.hasMany(IssueBook, {
  foreignKey: {
    name: 'bookId',
    allowNull: false,
  },
});
IssueBook.belongsTo(Book, {
  foreignKey: {
    name: 'bookId',
    allowNull: false,
  },
});

Category.hasMany(IssueBook, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
  },
});
IssueBook.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
  },
});

User.hasMany(IssueBook, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});
IssueBook.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

module.exports = IssueBook;
