//importa modulo express
const express = require('express');

const app = express();  
const Foto = require('./model/foto.js');
const User = require('./model/user.js');

app.get('/utenti', function (req, res) {
  User.findAll().then(users => {
      res.send(users);
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