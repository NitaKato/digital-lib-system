const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./../models/category');
const School = require('./school');

const Book = sequelize.define('book', {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.INTEGER,

    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cover_image: {
    type: Sequelize.STRING(220),
    allowNull: false,
  },
  author: {
    type: Sequelize.STRING(100),
    allowNull: false,
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

Category.hasMany(Book, {
  foreignKey: {
    name: 'categoryId',
  },
});
Book.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
  },
});

School.hasMany(Book, {
  foreignKey: {
    allowNull: false,
  },
});

Book.belongsTo(School, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = Book;
