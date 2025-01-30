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
//VERIFY TOKEN
router.get('/user_info/:visited_username', wrap_jwt, async function(req, res) {
    const visited_username = req.params.visited_username

    const caller_username = req.jwt_payload?.username ?? false
    const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
    //delete user_db_result._doc.password
    delete user_db_result._doc._id

    return res.status(200).json(user_db_result)
    
}
);
//VERIFY TOKEN
router.get('/count_follow/:visited_username', wrap_jwt, async function(req, res) {
    const visited_username = req.params.visited_username

    try{
        const caller_username = req.jwt_payload?.username ?? false;
        const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
        const user_id_str = user_db_result._doc._id.toString()    
        const followers_db_result = await Follower.countDocuments({ unique_pair: { $regex: `${user_id_str}$` } })
        const followed_db_result = await Follower.countDocuments({ unique_pair: { $regex: `^${user_id_str}` } })
        return res.status(200).json({"followers":followers_db_result,"followed":followed_db_result})
    }catch(error){
        return res.status(500).json(error.message);
    }
    
}
);

router.get('/count_post/:visited_username', wrap_jwt, async function(req, res) {
    const visited_username = req.params.visited_username

    try{
        const caller_username = req.jwt_payload?.username ?? false;
        const user_db_result = await User.findOne({ username: visited_username});//salting hash, implementa
        const user_id = user_db_result._doc._id    
        const post_count_deb_result = await Post.countDocuments({ owner__user_key: user_id })

        return res.status(200).json(post_count_deb_result)
    }catch(error){
        return res.status(500).json(error.message);
    }
    
}
);



router.get('/click_follow_to/:visited_username/:check', protect, async function(req, res) {
    const visited_username = req.params.visited_username
    const caller_username = req.jwt_payload?.username ?? false;
    const just_check = req.params.check
    var response = null
    try{
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
    }catch(error){
        return res.status(500).json(error.message);
    }
})

router.get('/exist/:visited_username/', async function(req, res) {
    const visited_username = req.params.visited_username
    try{
    const user_exist = await User.findOne({ username: visited_username});//salting hash, implementa
    const result = Boolean(user_exist)
    return res.status(200).json(result)

    }catch(error){
        return res.status(500).json(error.message);
    }
})



module.exports = router;
