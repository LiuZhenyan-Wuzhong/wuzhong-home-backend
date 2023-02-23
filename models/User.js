/*
 * @Author:
 * @Date: 2023-02-21 21:34:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-21 23:18:08
 * @Description:
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    provider: String,
    provider_id: String,
    token: String,
    provider_pic: String,
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

UserSchema.methods.follow = function (user_id) {
    if (this.following.indexOf(user_id) === -1) {
        this.following.push(user_id);
    }
    return this.save();
};

UserSchema.methods.addFollower = function (fs) {
    this.followers.push(fs);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
