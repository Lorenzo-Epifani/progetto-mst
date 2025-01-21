const mongoose = require('mongoose');
const User = require('./user.js');

const FollowerSchema = new mongoose.Schema({
  follower__user_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followed__user_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  unique_pair: {
    type: String,
    required: true,
    unique: true, 
  },
}, {
  collection: 'followers', 
  timestamps: true, 
});

FollowerSchema.pre('validate', function (next) {
  const ids = [this.follower__user_key.toString(), this.followed__user_key.toString()];
  this.unique_pair = `${ids[0]}_${ids[1]}`;
  next();
});

FollowerSchema.path('followed__user_key').validate(function (value) {
    return this.follower__user_key.toString() !== value.toString();
  }, 'Follower - Followed should be different.');



const Follower = mongoose.model('Follower', FollowerSchema);

module.exports = Follower;