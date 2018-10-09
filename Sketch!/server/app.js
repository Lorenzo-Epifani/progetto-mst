
var express = require('express'); //importa modulo express
var app = express();

app.get('/', function (req, res) {
  //res.send('Hello World!');
    
    //test connection
    sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
    
    User.findAll().then(users => {
  console.log(users);
        res.send(users);
    
}) //query
    
}); //rottaCusiPoiMeRicordu

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); //Avvia server e specifica porta

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

}); //connessione db

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
    );//crea tabella




// force: true will drop the table if it already exists
//User.sync({force: true}).then(() => {
  // Table created


// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
