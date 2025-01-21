const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
  from__user_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to__post_key: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'Post', 
  },
}, {
  collection: 'posts_likes', 
  timestamps: true,
});

PostLikeSchema.index({ from__user_key: 1, to__post_key: 1 }, { unique: true });

const PostLike = mongoose.model('PostLike', PostLikeSchema);

module.exports = PostLike;
