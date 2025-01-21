const mongoose = require('mongoose');

const CommentLikeSchema = new mongoose.Schema({
  from__user_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to__comment_key: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'Comment', 
  },
}, {
  collection: 'comments_likes', 
  timestamps: true,
});

CommentLikeSchema.index({ from__user_key: 1, to__comment_key: 1 }, { unique: true });

const CommentLike = mongoose.model('CommentLike', CommentLikeSchema);

module.exports = CommentLike;
