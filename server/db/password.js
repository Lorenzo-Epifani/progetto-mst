const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    username__user_key: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
}, {
    collection: 'passwords',
    timestamps: true,
});

PasswordSchema.pre('find', function () {
    this.select('-password');
});

PasswordSchema.pre('findOne', function () {
    this.select('-password');
});

PasswordSchema.pre('findById', function () {
    this.select('-password');
});
PasswordSchema.pre('aggregate', function () {
    this.select('-password');
});

//EXTRA DATA 
const Password = mongoose.model('Password', PasswordSchema);
module.exports = Password;
