// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


//VERIFY TOKEN
router.get('/myhome', function(req, res) {
    

}
);



module.exports = router;
