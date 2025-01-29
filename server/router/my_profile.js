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
router.get('/list_post', paginate, async function(req, res) {
    const PAGE_L=5 // Should be in a config
    const username = req.jwt_payload.username
    const user_db_result = await User.findOne({ username: username});//salting hash, implementa
    const user_id = user_db_result._doc._id
    
    const req_limit = req.paginate ? parseInt(req.paginate.limit) : PAGE_L;
    const req_skip = req.paginate ? parseInt(req.paginate.skip) : 0;
    
    const tot_posts_num = await Post.countDocuments({ owner__user_key: user_id }); // Totale post
    const has_more = req_limit + req_skip < tot_posts_num
    
    
    
    const post_list = await Post.find({ owner__user_key: user_id })
    .skip(req_skip) 
    .limit(req_limit) 
    .exec();
    post_list.map(el=>{
        delete el._doc.owner__user_key
        return el
    })
    
    const next_page_token = has_more ? token_utils.to_token({
        skip: req_skip+PAGE_L,
        limit: PAGE_L,
    }, 60) : null
    
    const response={
        post_list:post_list,
        has_more:has_more,
        next_token:next_page_token
    }
    
    return res.status(200).json(response)
    
}
);
//VERIFY TOKEN
router.get('/user_info', async function(req, res) {
    const username = req.jwt_payload.username
    const user_db_result = await User.findOne({ username: username});//salting hash, implementa
    delete user_db_result._doc._id

    return res.status(200).json(user_db_result)
    
}
);
//VERIFY TOKEN
router.get('/count_follow', async function(req, res) {
    try{
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id_str = user_db_result._doc._id.toString()    
        const followers_db_result = await Follower.countDocuments({ unique_pair: { $regex: `${user_id_str}$` } })
        const followed_db_result = await Follower.countDocuments({ unique_pair: { $regex: `^${user_id_str}` } })
        return res.status(200).json({"followers":followers_db_result,"followed":followed_db_result})
    }catch(error){
        return res.status(500).json(error.message);
    }
    
}
);

router.get('/count_post', async function(req, res) {
    try{
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id = user_db_result._doc._id    
        const post_count_deb_result = await Post.countDocuments({ owner__user_key: user_id })

        return res.status(200).json(post_count_deb_result)
    }catch(error){
        return res.status(500).json(error.message);
    }
    
}
);


//VERIFY TOKEN
router.get('/get_myprofile_data', function(req, res) {
    
}
); 

module.exports = router;
