// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../db/user');
var Follower = require('../db/follower');
const jwt_utils = require('../middleware/token.js');

const protect = jwt_utils.protect
const wrap_jwt = jwt_utils.wrap_jwt

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
        const db_result = await User.find({username: { $regex: search_string, $options: 'i' }}).limit(10);
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

router.get('/list_follow/:visited_username/:from_to', wrap_jwt,jwt_utils.paginate, async function(req, res) {
    const visited_username = req.params.visited_username

    try{
        
        const PAGE_L=5 // Should be in a config
        const caller_username = req.jwt_payload?.username ?? false;
        const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
        const user_id = user_db_result._doc._id
        const from_to = req.params.from_to; // 
        
        const actor1_query = from_to === "from" ? `^${user_id.toString()}` : from_to === "to" ? `${user_id.toString()}$` : null;
        //const actor2_query = from_to === "to" ? `^${user_id.toString()}` : from_to === "from" ? `^${user_id.toString()}` : null;
        if (!actor1_query){
            return res.sendStatus(404)
        }
        
        const req_limit = req.paginate ? parseInt(req.paginate.limit) : PAGE_L;
        const req_skip = req.paginate ? parseInt(req.paginate.skip) : 0;
        
        const tot_follow_num = await Follower.countDocuments({ unique_pair: { $regex: actor1_query } })
        const has_more = req_limit + req_skip < tot_follow_num
        const req_num = 1+parseInt(req_skip/PAGE_L)
        
        if ( !caller_username && req_num>MAX_UNAUTH_CALL){
            return res.sendStatus(423);
    
        } 
        
        
        const join_field={
            "from":"followed__user_key",
            "to":"follower__user_key"
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
                user_details: { $arrayElemAt: ['$user_details', 0] }, // Estrai l'oggetto direttamente dall'array
            }
            },
            {
              $project: {
                user_details: 1 
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
        
        const next_page_token = has_more ? jwt_utils.to_token({
            skip: req_skip+PAGE_L,
            limit: PAGE_L,
        }, 60) : null
        
        /*
        const resp_field={
            "from":"follower_list",
            "to":"followed_list"
        }
            */
        const response={
            profiles:follow_list,
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
