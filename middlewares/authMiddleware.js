const jwtKey = process.env.JWT_KEY || 'jwtKey';
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getValueFromCookie(cookie, targetKey) {
  const subCookies = cookie.split(';');
  for (let i = 0; i < subCookies.length; i++) {
    const [key, val] = subCookies[i].trim().split('=');
    if (key === targetKey) {
      return val;
    }
  }
  return null;
}

// 验证用户身份
const authMiddleware = (req, res, next) => {
  const { cookie } = req.headers;

  console.log('try sign in');
  // console.log(cookie);

  if (!cookie) {
    console.log(`Need cookie.`);
    return res.status(453).json({ msg: 'User not Sign in.' });
  }

  const token = getValueFromCookie(cookie, 'auth_token');

  if (token) {
    jwt.verify(token, jwtKey, async (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(453).json({ msg: 'Invalid token' });
      } else {
        const { id } = decoded;
        const user = await User.findById(id);
        if (!user) {
          console.log(`未查询到id: ${id}`);
          return res.status(453).json({ msg: `未查询到id: ${id}` });
        }
        req.user = user;
        req.id = id;
        next();
      }
    });
  } else {
    console.log('No token');
    return res.status(453).json({ msg: 'No token' });
  }
};

module.exports = authMiddleware;
