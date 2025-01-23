const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },

}, {
  collection: 'users',
  timestamps: true,
});

UserSchema.pre('find', function () {
    this.select('-password');
  });
  
  UserSchema.pre('findOne', function () {
    this.select('-password');
  });
  
  UserSchema.pre('findById', function () {
    this.select('-password');
  });

//EXTRA DATA 
const User = mongoose.model('User', UserSchema);
module.exports = User;
