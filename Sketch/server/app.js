//importa modulo express
const express = require('express');
var bodyParser = require('body-parser');
const app = express(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Foto = require('./model/foto.js');
const User = require('./model/user.js');
const Like = require('./model/like.js');
var AuthController = require('./auth/AuthController');
app.use('/auth', AuthController);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/utente/:id', function (req, res) {
  
  var id = req.params.id;
  User.findById(id).then(user =>{
    res.send(user);
  })
 
});

app.get('/utenti', function (req,res) {
   
  User.findAll().then(users => {
      res.send(users);
  });
});

app.get('/like/:idFoto', function (req,res) {
  var idFoto = req.params.idFoto;
  Like.findAll({
  attributes: ['Utente_ID'],
  where: {
    Foto_ID : idFoto 
  }
}).then(likes => {
      res.send(likes);
  });
});



app.get('/foto', function(req, res){
  Foto.findAll().then(foto => {
    res.send(foto);
  })
});
//Avvia server e specifica porta
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); 



app.get('/porcoddio/:id', function(req, res){
  var id = req.params.id;
    


   Foto.findById(id).then(foto =>{
     res.sendFile(foto.url , { root: __dirname });
   })
  
});

app.get('/login:idUser:psw', function(req,res){
  var id= req.params.id;
  var psw= req.params.psw;
  
  User.findAll({
    where: {
    nome : idUser,
    password: psw
  }
      }).then(hash =>{
    res.send(hash);
  })
  
});

app.get('/test', function(req, res){
 console.log(req.body);
  
});
