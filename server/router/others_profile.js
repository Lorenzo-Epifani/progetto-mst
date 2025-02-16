var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const token_utils = require('../middleware/token.js');
var Follower = require('../db/follower.js');
var User = require('../db/user.js');
var Post = require('../db/post.js');

const wrap_jwt = token_utils.wrap_jwt
const protect = token_utils.protect
const paginate = token_utils.paginate
const mongoose = require('mongoose');
const wrap_errors = require('../middleware/logging.js').asyncHandler;


//router.use(wrap_jwt); // MIDDLEWARE TO ALL API


router.get('/list_post/:visited_username', wrap_jwt, paginate, wrap_errors(async function(req, res) {
    const PAGE_L=5 // Should be in a config
    const MAX_UNAUTH_CALL=2 // Should be in a config
    const caller_username = req.jwt_payload?.username ?? false;
    const visited_username = req.params.visited_username
    
    const vst_usr_result = await User.findOne({ username: visited_username});//salting hash, implementa
    if (!vst_usr_result){
        return res.sendStatus(404);
    }
    const vst_user_id = vst_usr_result._doc._id
    
    const req_limit = req.paginate ? parseInt(req.paginate.limit) : PAGE_L;
    const req_skip = req.paginate ? parseInt(req.paginate.skip) : 0;
    const req_num = 1+parseInt(req_skip/PAGE_L)
    
    if ( !caller_username && req_num>MAX_UNAUTH_CALL){
        return res.sendStatus(423);
        
    }
    
    const tot_posts_num = await Post.countDocuments({ owner__user_key: vst_user_id }); // Totale post
    const has_more = req_limit + req_skip < tot_posts_num
    
    
    
    const post_list = await Post.find({ owner__user_key: vst_user_id })
    .sort({ createdAt: -1 }) 
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
)
);
//VERIFY TOKEN
router.get('/user_info/:visited_username', wrap_jwt, wrap_errors(async function(req, res) {
    const visited_username = req.params.visited_username
    
    const caller_username = req.jwt_payload?.username ?? false
    const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
    //delete user_db_result._doc.password
    delete user_db_result._doc._id
    
    return res.status(200).json(user_db_result)
    
}
)
);
//VERIFY TOKEN
router.get('/count_follow/:visited_username', wrap_jwt, wrap_errors(async function(req, res) {
    const visited_username = req.params.visited_username
    
    const caller_username = req.jwt_payload?.username ?? false;
    const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
    const user_id_str = user_db_result._doc._id.toString()    
    const followers_db_result = await Follower.countDocuments({ unique_pair: { $regex: `${user_id_str}$` } })
    const followed_db_result = await Follower.countDocuments({ unique_pair: { $regex: `^${user_id_str}` } })
    return res.status(200).json({"followers":followers_db_result,"followed":followed_db_result})
    
}
)
);

router.get('/count_post/:visited_username', wrap_jwt, wrap_errors(async function(req, res) {
    const visited_username = req.params.visited_username
    
    const caller_username = req.jwt_payload?.username ?? false;
    const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
    const user_id = user_db_result._doc._id    
    const post_count_deb_result = await Post.countDocuments({ owner__user_key: user_id })
    
    return res.status(200).json(post_count_deb_result)
    
}
)
);



router.get('/click_follow_to/:visited_username/:check', protect, wrap_errors(async function(req, res) {
    const visited_username = req.params.visited_username
    const caller_username = req.jwt_payload?.username ?? false;
    const just_check = req.params.check
    var response = null
    const visited_id = (await User.findOne({ username: visited_username}))._doc._id.toString()
    const caller_id = (await User.findOne({ username: caller_username}))._doc._id.toString()
    const unique_pair = `${caller_id}_${visited_id}`
    
    const exist = await Follower.findOne({ unique_pair: unique_pair });
    response = Boolean(exist)
    if (just_check==="check"){
        return res.status(200).json(response)
    }
    
    if (exist){
        await Follower.deleteOne({ unique_pair: unique_pair });
        response="REMOVED"
    } else {
        const newFollower = new Follower({
            unique_pair: unique_pair,
            follower__user_key: caller_id,
            followed__user_key: visited_id,
        });
        //const session = await mongoose.startSession();
        //await session.commitTransaction();
        //await newFollower.save({ session });
        await newFollower.save();
        response="ADDED"
    }
    return res.status(200).json(response)
}
)
)

router.get('/exist/:visited_username/', wrap_errors(async function(req, res) {
    const visited_username = req.params.visited_username
        const user_exist = await User.findOne({ username: visited_username});//salting hash, implementa
        const result = Boolean(user_exist)
        return res.status(200).json(result)
        
}))



module.exports = router;
