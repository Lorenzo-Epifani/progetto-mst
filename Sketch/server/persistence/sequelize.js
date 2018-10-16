const Sequelize = require('sequelize');  //importa modulo sequelize
const sequelize = new Sequelize('mydb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

exports.mydb = sequelize;