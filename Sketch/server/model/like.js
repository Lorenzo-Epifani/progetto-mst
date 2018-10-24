const Sequelize = require('sequelize');  //importa modulo sequelize
const persistence= require('../persistence/sequelize.js');
const User = require('./user.js');
const Foto = require('./foto.js');

let definition = {
  Utente_ID: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    references: {
      // This is a reference to another model
      model: User,
      // This is the column name of the referenced model
      key: 'ID',
      
     
    }
  },
  
  Foto_ID: {
    type: Sequelize.INTEGER,
          primaryKey:true,

    references: {
      // This is a reference to another model
      model: Foto,
      // This is the column name of the referenced model
      key: 'ID',
      
    }
  },
  
 
}

let props = {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
};

  
module.exports=persistence.mydb.define('like', definition , props);