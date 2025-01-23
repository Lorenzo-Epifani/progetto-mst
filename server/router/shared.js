// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../db/user');
const jwt_utils = require('../middleware/token.js');
const protect = jwt_utils.protect

router.get('/whoami', protect, async function (req, res) {
    try {
        const username = req.jwt_payload.username
        return res.status(200).json(username)
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

router.get('/search', async function (req, res) {
    try {
        const search_string = req.headers['search_string']
        const db_result = await User.find({username: { $regex: search_string, $options: 'i' }}).limit(6);
        db_result.map(el=>{
            el._doc={
                username:el._doc.username,
                img:el._doc.img,
            }
        })
        return res.status(200).json(db_result)
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

module.exports = router;
