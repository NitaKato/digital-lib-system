const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define(
  'admin',
  {
    name: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Admin;
