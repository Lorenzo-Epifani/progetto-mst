const mongoose = require('mongoose');
const User = require('./user.js');
const Post = require('./post.js');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true, 
  },
  author__user_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
 target__post_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', 
    required: true, 
  },
}, {
  collection: 'comments',
  timestamps: true, 
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
