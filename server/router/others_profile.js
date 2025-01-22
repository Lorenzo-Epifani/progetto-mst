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
const paginate = token_utils.paginate


router.use(wrap_jwt); // MIDDLEWARE TO ALL API


    router.get('/list_post/:visited_username', paginate, async function(req, res) {
    const PAGE_L=5 // Should be in a config
    const caller_username = req.jwt_payload?.username ?? false;
    const visited_username = req.params.visited_username
    
    const vst_usr_result = await User.findOne({ username: visited_username});//salting hash, implementa
    if (!vst_usr_result){Amanda.Lang
        return res.status(401).message("Bad Request");
    }
    const vst_user_id = vst_usr_result._doc._id
    
    const req_limit = req.paginate ? parseInt(req.paginate.limit) : PAGE_L;
    const req_skip = req.paginate ? parseInt(req.paginate.skip) : 0;
    
    const tot_posts_num = await Post.countDocuments({ owner__user_key: vst_user_id }); // Totale post
    const has_more = req_limit + req_skip < tot_posts_num
    
    
    
    const post_list = await Post.find({ owner__user_key: vst_user_id })
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
router.get('/user_info/:visited_username', async function(req, res) {
    const visited_username = req.params.visited_username

    const username = req.jwt_payload.username
    const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
    delete user_db_result._doc.password
    delete user_db_result._doc._id

    return res.status(200).json(user_db_result)
    
}
);
//VERIFY TOKEN
router.get('/count_follow/:visited_username', async function(req, res) {
    const visited_username = req.params.visited_username

    try{
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
        const user_id_str = user_db_result._doc._id.toString()    
        const followers_db_result = await Follower.countDocuments({ unique_pair: { $regex: `^${user_id_str}` } })
        const followed_db_result = await Follower.countDocuments({ unique_pair: { $regex: `${user_id_str}$` } })
        return res.status(200).json({"followers":followers_db_result,"followed":followed_db_result})
    }catch(error){
        return res.status(500).json(error.message);
    }
    
}
);

router.get('/count_post/:visited_username', async function(req, res) {
    const visited_username = req.params.visited_username

    try{
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
        const user_id = user_db_result._doc._id    
        const post_count_deb_result = await Post.countDocuments({ owner__user_key: user_id })

        return res.status(200).json(post_count_deb_result)
    }catch(error){
        return res.status(500).json(error.message);
    }
    
}
);


router.get('/list_follow/:visited_username/:from_to', async function(req, res) {
    const visited_username = req.params.visited_username

    try{
        
        const PAGE_L=5 // Should be in a config
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id = user_db_result._doc._id
        const from_to = req.params.from_to; // 
        
        const actor1_query = from_to === "from" ? `^${user_id.toString()}` : from_to === "to" ? `${user_id.toString()}$` : null;
        //const actor2_query = from_to === "to" ? `^${user_id.toString()}` : from_to === "from" ? `^${user_id.toString()}` : null;
        if (!actor1_query){throw new Error("Unknown path")}
        
        const req_limit = req.paginate ? parseInt(req.paginate.limit) : PAGE_L;
        const req_skip = req.paginate ? parseInt(req.paginate.skip) : 0;
        
        const tot_follow_num = await Follower.countDocuments({ unique_pair: { $regex: actor1_query } })
        const has_more = req_limit + req_skip < tot_follow_num
        
        
        
        
        const join_field={
            "to":"follower__user_key",
            "from":"followed__user_key"
        }
        const field_name=`${from_to}__user_key`
        const follow_list = await Follower.aggregate([
            {
              $match: {
                unique_pair: { $regex: actor1_query } 
              }
            },
            {
              $lookup: {
                from: 'users', 
                localField: join_field[from_to], 
                foreignField: '_id', 
                as: 'user_details'
              }
            },
            {
              $addFields: {
                [field_name]: { $arrayElemAt: ['$user_details.username', 0] }
              }
            },
            {
              $project: {
                user_details: 0 
              }
            },
            {
              $skip: req_skip 
            },
            {
              $limit: req_limit 
            }
          ]);
        follow_list.map(el=>{
            delete el.followed__user_key
            delete el.follower__user_key
            delete el.unique_pair
            return el
        })
        
        const next_page_token = has_more ? token_utils.to_token({
            skip: req_skip+PAGE_L,
            limit: PAGE_L,
        }, 60) : null
        
        const resp_field={
            "from":"follower_list",
            "to":"followed_list"
        }
        const response={
            [resp_field[from_to]]:follow_list,
            has_more:has_more,
            next_token:next_page_token
        }
        
        return res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message);
    }
}
);



module.exports = router;
