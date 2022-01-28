const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('category', {
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
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

module.exports = Category;
