// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var multer = require('multer')
var upload = multer();



router.post('/register', function(req, res) {
  
 console.log('the Username is', req.body.Username);
  console.log('the Password is', req.body.Password);

 var hashedPassword =req.body.Password /* bcrypt.hashSync(req.body.Password, 4) */

   User.create({
    nome : req.body.Username,
    password : hashedPassword,
    
  }).then(user =>{
    
    // create a token
    console.log('porcodio2');
    var token = jwt.sign({ id: user.ID }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({auth: true, token: token });
  
    
    
   }).catch(err => {
    console.log('porcodio1');
    if (err) return res.status(500).send("There was a problem registering the user.")
   });}
);



router.get('/me',  function(req, res) {

  console.log(req.body);

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
});  

module.exports = router;