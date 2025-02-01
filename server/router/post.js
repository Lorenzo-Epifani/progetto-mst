var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const token_utils = require('../middleware/token.js');
var Follower = require('../db/follower.js');
var Comment = require('../db/comment.js');
var User = require('../db/user.js');
var Post = require('../db/post.js');
var PostLike = require('../db/post_like.js');
const CommentLike = require('../db/comment_like.js');
const ObjectId = require('bson').ObjectId;

const wrap_jwt = token_utils.wrap_jwt
const protect = token_utils.protect
const paginate = token_utils.paginate
const wrap_errors = require('../middleware/logging.js').asyncHandler;




router.get('/init', protect, wrap_errors(async function(req, res) {
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
    var caller_id = null
    if(caller_username){
        caller_id = await User.findOne({username: caller_username})
        liked = await PostLike.countDocuments({from__user_key: caller_id._doc._id, to__post_key: post_id})
    }

    const comments_query = [
        {
          $match: { target__post_key: new ObjectId(post_id) } // Filtra i commenti per il post richiesto
        },
        {
          $lookup: {
            from: "users", // Unisce con la tabella 'users'
            localField: "author__user_key",
            foreignField: "_id",
            as: "author_details"
          }
        },
        {
          $unwind: "$author_details" // Trasforma l'array 'author_details' in un oggetto
        },
        {
          $lookup: {
            from: "comments_likes", // Unisce con 'comments_likes' per contare i like
            localField: "_id",
            foreignField: "to__comment_key",
            as: "likes"
          }
        }
      ]

    if(caller_username){
        comments_query.push(
            {
                $addFields: {
                  author_username: "$author_details.username", // Aggiunge l'username dell'autore
                  likes_count: { $size: "$likes" }, // Conta il numero di like
                  i_liked: { 
                      $cond: { 
                        if: { 
                          $eq: [ 
                            { $size: { 
                              $filter: { 
                                input: "$likes", 
                                as: "like", 
                                cond: { $eq: ["$$like.from__user_key", new ObjectId(caller_id)] } // Controlla se caller_id ha messo like
                              }
                            }}, 
                            1
                          ] 
                        }, 
                        then: true, 
                        else: false
                      }
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  content: 1,
                  author_username: 1,
                  likes_count: 1,
                  i_liked: 1,
                  createdAt:1
                }
              }
        )
    }else{
        comments_query.push({
            $set: {
                i_liked: false
              }
        })
    }


    const comments = await Comment.aggregate(comments_query);
      


    const response={
        owner_name,
        owner_img,
        post_img,
        likes_count,
        liked,
        post_cpt,
        comments,
    }
    
    return res.status(200).json(response)
    
}
)
);

router.get('/click_like/', protect, wrap_errors(async function(req, res) {
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

}
)
)


router.get('/click_like_comment/', protect, wrap_errors(async function(req, res) {
    const comment_id = req.headers['comment_id']
    const caller_username = req.jwt_payload?.username ?? false

    const user_db_result = await User.findOne({username: caller_username})
    const caller_id = user_db_result._doc._id


    const existingLikeComment = Boolean(await CommentLike.findOne({ from__user_key: caller_id, to__comment_key: comment_id }))
    var result = null
    if (existingLikeComment) {
        await CommentLike.findOneAndDelete({ from__user_key: caller_id, to__comment_key: comment_id });
        result="unlike"
    } else {
        // Se non esiste, lo creiamo
        await CommentLike.create({ from__user_key: caller_id, to__comment_key: comment_id });
        result="like"
    }    
    return res.status(200).json(result)

}
)
)

router.get('/new_comment/', protect, wrap_errors(async function(req, res) {
    const post_id = req.headers['post_id']
    const comment_content = req.headers['content']
    const caller_username = req.jwt_payload?.username ?? false

    const user_db_result = await User.findOne({username: caller_username})
    const caller_id = user_db_result._doc._id

    await Comment.create({ content: comment_content, author__user_key: caller_id, target__post_key:post_id });

    return res.status(200).json("comment inserted")

}
)
)

module.exports = router;
