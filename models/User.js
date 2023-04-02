const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  email: { type: String, required: true, unique: true },
  profile: String,
  hashPassword: { type: String, required: true },
  avatorImgUrl: String,
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  signup_time: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  if (!this.name) {
    this.name = `User_${Date.now().toString()}`;
  }
  next();
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
