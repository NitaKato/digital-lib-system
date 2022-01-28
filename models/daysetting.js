const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const DaySetting = sequelize.define('daysetting', {
  total_days: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('1', '0'),
    defaultValue: '1',
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

module.exports = DaySetting;
