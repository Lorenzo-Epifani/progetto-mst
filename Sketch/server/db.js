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
  },
     }
                               );

 
const User = sequelize.define('utente', {
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
    
const Foto = sequelize.define('foto', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  
  titolo: {
    type: Sequelize.STRING
      
      
  },
  like: {
    type: Sequelize.INTEGER

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
},{
  freezeTableName: true,
  createdAt: false,
  updatedAt: false

}                         
                      );

exports.User=User;
exports.Foto=Foto;
exports.stringa='dioporco';


