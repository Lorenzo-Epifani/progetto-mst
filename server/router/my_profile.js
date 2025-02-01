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
const wrap_errors = require('../middleware/logging.js').asyncHandler;


router.use(protect); // MIDDLEWARE TO ALL API

async function isValidImage(url) {
    try {
        const response = await fetch(url, { method: "HEAD" }); // Controlla solo gli headers
        const contentType = response.headers.get("content-type");
        return contentType && contentType.startsWith("image");
    } catch (error) {
        return false; // Se la richiesta fallisce, l'URL non è valido
    }
}

//VERIFY TOKEN
router.get('/list_post', paginate, wrap_errors(async function(req, res) {
    const PAGE_L=5 // Should be in a config
    const username = req.jwt_payload.username
    const user_db_result = await User.findOne({ username: username});//salting hash, implementa
    const user_id = user_db_result._doc._id
    
    const req_limit = req.paginate ? parseInt(req.paginate.limit) : PAGE_L;
    const req_skip = req.paginate ? parseInt(req.paginate.skip) : 0;
    
    const tot_posts_num = await Post.countDocuments({ owner__user_key: user_id }); // Totale post
    const has_more = req_limit + req_skip < tot_posts_num
    
    
    
    const post_list = await Post.find({ owner__user_key: user_id })
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
));
//VERIFY TOKEN
router.get('/user_info', wrap_errors(async function(req, res) {
    const username = req.jwt_payload.username
    const user_db_result = await User.findOne({ username: username});//salting hash, implementa
    delete user_db_result._doc._id

    return res.status(200).json(user_db_result)
    
}
));
//VERIFY TOKEN
router.get('/count_follow', wrap_errors(async function(req, res) {
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
));

router.get('/count_post', wrap_errors(async function(req, res) {
        const username = req.jwt_payload.username
        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id = user_db_result._doc._id    
        const post_count_deb_result = await Post.countDocuments({ owner__user_key: user_id })

        return res.status(200).json(post_count_deb_result)
    
}
)
);

router.get('/new_post', wrap_errors(async function(req, res) {
        const username = req.jwt_payload.username
        const post_data = JSON.parse(req.headers['post_data'])
        if (!post_data['img'] || !(await isValidImage(post_data['img'])) || !post_data['caption']){
            return res.sendStatus(400)
        }

        const user_db_result = await User.findOne({ username: username});//salting hash, implementa
        const user_id = user_db_result._doc._id 
        const new_post_document = {
            owner__user_key:user_id,
            img:post_data['img'],
            caption:post_data['caption']
        }
        
        const post_count_deb_result = await Post.insertMany([new_post_document])

        return res.status(200).json(post_count_deb_result)
    
}
)
);

router.get('/change_propic', wrap_errors(async function(req, res) {
    const username = req.jwt_payload.username
    const img_url = JSON.parse(req.headers['img_url'])
    if (!img_url || !(await isValidImage(img_url))){
        return res.sendStatus(400)
    }

    const update_image_response = await User.updateOne(
        { username: username }, 
        { $set: { img: img_url } }
    );

    return res.status(200).json(update_image_response)

}
)
);

router.get('/change_caption', wrap_errors(async function(req, res) {
    const username = req.jwt_payload.username
    const caption = req.headers['caption']
    if (!caption){
        return res.sendStatus(400)
    }

    const update_caption_response = await User.updateOne(
        { username: username }, 
        { $set: { caption: caption } }
    );

    return res.status(200).json(update_caption_response)

}
)
);

//VERIFY TOKEN
router.get('/get_myprofile_data', function(req, res) {
    
}
); 

module.exports = router;
