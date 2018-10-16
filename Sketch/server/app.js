var express = require('express'); //importa modulo express
var app = express();  
var Foto = require('./model/foto.js');
var User = require('./model/user.js');


app.get('/', function (req, res) {
  //res.send('Hello World!');
User.findAll().then(users => {
  console.log(users);
        res.send(users);
    
    res.sendFile("C:/Users/Lorenzo/Desktop/Progetto mst/Sketch!/index.html");
    })//query
    
}); //rottaCusiPoiMeRicordu


app.get('/foto', function(req, res){
  Foto.findAll().then(foto => {
    res.send(foto);
  })
  
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); //Avvia server e specifica porta





//connessione db

                   
