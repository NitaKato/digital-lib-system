require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.HOST,
    dialect: 'mysql',
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log('CONNECTED!');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = sequelize;
