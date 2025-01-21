// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const token_utils = require('../middleware/token.js');
var Follower = require('../db/follower');
var User = require('../db/user');
var Post = require('../db/post');

const protect = token_utils.protect
const paginate = token_utils.paginate


router.use(protect); // MIDDLEWARE TO ALL API


//VERIFY TOKEN
    router.get('/myposts', paginate, async function(req, res) {
        const BASE_SKIP=30 // Should be in a config
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id = user_db_result._doc._id
        
        const limit = parseInt(req.paginate.limit)
        const offset = parseInt(req.paginate.offset)
        const has_more = req.paginate.has_more

        const tot_posts_num = await Post.countDocuments({ owner__user_key: user_id }); // Totale post

        const post_list = await Post.find({ owner__user_key: user_id })
            .skip(offset) 
            .limit(limit) 
            .exec();
        const page_token = token_utils.to_token()


        return res.status(200).send(post_list)

    }
    );
//VERIFY TOKEN
router.get('/whoami', function(req, res) {
    
    return res.status(200).send(req.jwt_payload)

}
);
//VERIFY TOKEN
router.get('/list_follow', async function(req, res) {
    try{
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id_str = user_db_result._doc._id.toString()    
        const followers_db_result = await Follower.countDocuments({ unique_pair: { $regex: `^${user_id_str}` } })
        const followed_db_result = await Follower.countDocuments({ unique_pair: { $regex: `${user_id_str}$` } })
        return res.status(200).send({"followers":followers_db_result,"followed":followed_db_result})
    }catch(error){
        return res.status(500).send(error.message);
    }

}
);


//VERIFY TOKEN
router.get('/get_myprofiledata', function(req, res) {
    
}
); 

module.exports = router;
