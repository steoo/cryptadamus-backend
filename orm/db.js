const Sequelize = require('sequelize');

// make parameters dynamic
const sequelize = new Sequelize('cryptadamus', 'root', 'cristoincroce', {
  host: 'localhost',
  dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  timestamps: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;