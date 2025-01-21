const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  owner__user_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  img: {
    type: String,
    required: true, 
  },
  caption: {
    type: String,
    required: true, 
  },
}, {
  collection: 'posts', 
  timestamps: true,
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
