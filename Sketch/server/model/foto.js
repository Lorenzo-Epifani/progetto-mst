const Sequelize = require('sequelize');  //importa modulo sequelize
const User = require('./user.js')
const persistence= require('../persistence/sequelize.js');

let definition = {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  titolo: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  Utente_ID: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,
      // This is the column name of the referenced model
      key: 'ID',
    }
  }
};

const props = {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
};

module.exports=persistence.mydb.define('foto', definition, props);