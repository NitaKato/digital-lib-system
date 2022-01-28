const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Option = sequelize.define('option', {
  option_name: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  option_value: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
});

module.exports = Option;
