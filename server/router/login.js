// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../db/user');
const jwt_utils = require('../middleware/token.js');


//TODO
router.post('/register', function(req, res) {
  
}
);


/*
router.get('/me',  function(req, res) {

  console.log(req.body);

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
});  
*/

router.get('/login', async function (req, res) {
    const failed={status:401,message:"Login Failed"}
    try {
        const { user, psw } = req.headers;
        if (!user || !psw) {
            return res.status(failed.status).send(failed);
        }
        const db_result = await User.findOne({ username: user, password: psw });//salting hash, implementa
        if (!db_result) {
            return res.status(failed.status).send(failed);
        }
        const response = await jwt_utils.get_access_token(db_result._doc)
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = router;
