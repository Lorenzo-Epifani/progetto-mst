var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const token_utils = require('../middleware/token.js');
var Follower = require('../db/follower.js');
var User = require('../db/user.js');
var Post = require('../db/post.js');
var PostLike = require('../db/post_like.js');
const ObjectId = require('bson').ObjectId;

const wrap_jwt = token_utils.wrap_jwt
const protect = token_utils.protect
const paginate = token_utils.paginate




router.get('/init', protect, async function(req, res) {
    const post_id = req.headers['post_id']
    try{
    if (!post_id || !(new ObjectId(post_id).toString() === post_id)){
        return res.sendStatus(400)
    }}catch(err){
        return res.sendStatus(400)
    }
    const caller_username = req.jwt_payload?.username ?? false
    var liked = 0
    
    const post_db_result = await Post.findOne({ _id: post_id});//salting hash, implementa
    if (!post_db_result){
        return res.sendStatus(400)
    }
    const post_img = post_db_result._doc.img
    const post_cpt = post_db_result._doc.caption

    const user_db_result = await User.findOne({_id: post_db_result._doc.owner__user_key})
    const owner_img = user_db_result._doc.img
    const owner_name = user_db_result._doc.username

    const likes_count = await PostLike.countDocuments({to__post_key:post_id})

    if(caller_username){
        const caller_id = await User.findOne({username: caller_username})
        liked = await PostLike.countDocuments({from__user_key: caller_id._doc._id, to__post_key: post_id})
    }
    const response={
        owner_name,
        owner_img,
        post_img,
        likes_count,
        liked,
        post_cpt
    }
    
    return res.status(200).json(response)
    
}
);

router.get('/click_like/', protect, async function(req, res) {
    try{
    const visited_username = req.params.visited_username
    const post_id = req.headers['post_id']
    const caller_username = req.jwt_payload?.username ?? false

    const user_db_result = await User.findOne({username: caller_username})
    const caller_id = user_db_result._doc._id


    const existingLike = Boolean(await PostLike.findOne({ from__user_key: caller_id, to__post_key: post_id }))
    var result = null
    if (existingLike) {
        await PostLike.findOneAndDelete({ from__user_key: caller_id, to__post_key: post_id });
        result="unlike"
    } else {
        // Se non esiste, lo creiamo
        await PostLike.create({ from__user_key: caller_id, to__post_key: post_id });
        result="like"
    }    
    return res.status(200).json(result)

    }catch(error){
        return res.status(500).json(error.message);
    }
})


module.exports = router;
