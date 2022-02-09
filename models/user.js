const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const School = require('./school');

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING(120),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(120),
    allowNull: false,
  },
  mobile: {
    type: Sequelize.STRING(25),
    allowNull: false,
  },
  gender: {
    type: Sequelize.ENUM('male', 'female', 'other'),
  },
  address: {
    type: Sequelize.TEXT,
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

School.hasMany(User, {
  foreignKey: {
    allowNull: false,
  },
});

User.belongsTo(School, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = User;
