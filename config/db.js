// require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('lms', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});
sequelize
  .authenticate()
  .then(() => {
    console.log('CONNECTED!');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = sequelize;
