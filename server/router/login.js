// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../db/user');
var Password = require('../db/password');
const jwt_utils = require('../middleware/token.js');
const wrap_errors = require('../middleware/logging.js').asyncHandler;


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

router.get('/login', wrap_errors(async function (req, res) {
        const { user, psw } = req.headers;
        if (!user || !psw) {
            return res.sendStatus(400);
        }
        const user_result = await User.findOne({ username: user});//salting hash, implementa
        if (!user_result) {
            return res.sendStatus(403);
        }
        const h_psw = jwt_utils.hash_psw(psw)
        const psw_result = await Password.findOne({ username__user_key: user_result._doc._id, password: h_psw });//salting hash, implementa
        if (!psw_result) {
            return res.sendStatus(403);
        }
        const response = await jwt_utils.get_access_token(user_result._doc)
        return res.status(200).send(response)
}));

module.exports = router;
