const Sequelize = require('sequelize');  //importa modulo sequelize
var persistence= require('../persistence/sequelize.js')


 
const User = persistence.mydb.define('utente', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING
      
      
  },
  password: {
    type: Sequelize.STRING

},
  ruolo: {
      
    type: Sequelize.INTEGER

  }
    
    
} 
    , {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false

}                         
    );
    

module.exports=User;



