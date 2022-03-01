const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const School = require('./school');

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
    isSuperAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    passwordResetExpires: Sequelize.STRING,
    passwordResetToken: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);

School.hasMany(Admin);

Admin.belongsTo(School);

module.exports = Admin;
