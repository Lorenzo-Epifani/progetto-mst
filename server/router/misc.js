var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const token_utils = require('../middleware/token.js');
var Follower = require('../db/follower.js');
var User = require('../db/user.js');
var Post = require('../db/post.js');

const paginate = token_utils.paginate


module.exports = router;
