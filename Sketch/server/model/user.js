const Sequelize = require('sequelize');  //importa modulo sequelize
const persistence= require('../persistence/sequelize.js')

let definition = {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
     autoIncrement: true,
  },
  nome: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING
  },
  ruolo: {
    type: Sequelize.INTEGER,
     defaultValue: '1'
  }
};

let props = {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
};

module.exports=persistence.mydb.define('utente', definition , props);



