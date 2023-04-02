const User = require('../models/User');
const Article = require('../models/Article');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY || 'jwtKey';

const getHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const userCtrller = {
  checkUser: (req, res, next) => {
    console.log('checkUser');
    res.send('valid');
    next();
  },

  getUser: (req, res, next) => {
    console.log('getUser');
    User.findById(req.params.id).then((err, user) => {
      if (err) res.send(err);
      else if (!user) res.send(404);
      else res.send(user);
      next();
    });
  },

  getUserByEmail: (req, res, next) => {
    const { email } = req.params;
    User.find({ email }).then((err, user) => {
      if (err) res.send(err);
      else if (!user) res.send(404);
      else res.send(user[0]);
      next();
    });
  },

  getAllUser: async (req, res, next) => {
    const users = await User.find();
    res.status(200).send(users);
    next();
  },

  followUser: (req, res, next) => {
    const { email } = req;
    const { id } = req.body;
    const targetUser = User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ msg: 'No such user, whose id is' + id });
    }
    try {
      const user = User.find({ email });
      return user.follow(id).then(() => {
        return res.json({ msg: 'followed' });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ msg: 'followed error: ' + err });
    }
  },

  getUserProfile: (req, res, next) => {
    const { id } = req.params;
    const targetUser = User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ msg: 'No such user, whose id is' + id });
    }

    try {
      const profile = targetUser.toObject();

      const { following, followers } = targetUser;

      following.forEach((id) => {
        profile.following.push(User.findById(id).toObject());
      });
      followers.forEach((id) => {
        profile.followers.push(User.findById(id).toObject());
      });

      const articles = Article.find({ author: id });

      articles.forEach((article) => {
        profile.articles.push(article.toObject());
      });

      return res.json(profile);
    } catch (error) {
      console.error(error);
      return res.status(400).json(error);
    }
  },

  signIn: async (req, res, next) => {
    const { email, password, rememberMe } = req.body;

    const targetUsers = await User.find({ email });

    if (targetUsers.length === 0) {
      console.error(`${email} 对应的user未找到`);
      return res.status(404).json({ msg: `${email} 对应的user未找到` });
    }

    const hashPassword = targetUsers[0].hashPassword;

    const isMatch = bcrypt.compareSync(password, hashPassword);

    if (!isMatch) {
      return res.status(403).json({ msg: 'Wrong password.' });
    }

    const id = targetUsers[0];

    const token = jwt.sign({ id, email, hashPassword }, jwtKey, {
      expiresIn: '36000s'
    });
    const { hashPassword: pw, ...other } = targetUsers[0].toObject();

    console.log(`${targetUsers[0]._id} sign in successfully.`);

    return res
      .cookie('auth_token', token, {
        httpOnly: true
      })
      .status(200)
      .json(other);
  },

  signOut: async (req, res, next) => {
    const { id } = req.params;

    const targetUser = await User.findById(id);

    if (!targetUser) {
      console.error(`user is not found.`);
      return res.status(404).json({ msg: `user is not found.` });
    }

    return res
      .clearCookie('auth_token', {
        sameSite: 'none',
        secure: true
      })
      .status(200)
      .json({});
  },

  addUser: async (req, res, next) => {
    try {
      console.log('收到请求体：', req.body); // params 是url参数，body是post数据

      const { name, email, password, token, avatorImgUrl } = req.body;

      // check duplicate
      const targetUser = await User.find({ email });
      if (targetUser.length > 0) {
        return res.status(409).json({ msg: `${email} 对应的user已存在` });
      }

      const hashPassword = await getHashPassword(password);

      // create
      const newUser = await User.create({
        name,
        email,
        hashPassword,
        token,
        avatorImgUrl
      });

      return res.status(201).json(newUser.toObject());
    } catch (err) {
      console.error(err);
      return res.status(400).json({ msg: err });
    }
  },

  removeUser: async (req, res, next) => {
    try {
      req.user.delete();
      return res.status(203).json({});
    } catch (err) {
      return res.status(400).json({ msg: 'Fail to remove user. Error: ' + err.toString() });
    }
  },

  updateProfile: async (req, res, next) => {
    const { user } = req;
    const { name, avatorImgUrl } = req.body;

    await user.update({
      name,
      avatorImgUrl
    });

    const updateUser = await User.findById(user._id);

    return res.status(200).json(updateUser.toObject());
  }
};

module.exports = userCtrller;
