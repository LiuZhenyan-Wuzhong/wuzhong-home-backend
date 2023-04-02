/*
 * @Author:
 * @Date: 2023-02-22 00:57:35
 * @LastEditors:
 * @LastEditTime: 2023-02-23 21:55:28
 * @Description:
 */
const userCtrller = require('../controllers/user.ctrl');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = (router) => {
  router.route('/user/check/auth').get(authMiddleware, userCtrller.checkUser);

  router.route('/user/:id').get(authMiddleware, userCtrller.getUser);

  router.route('/user/email/:email').get(authMiddleware, userCtrller.getUserByEmail);

  router.route('/user/profile/:id').get(authMiddleware, userCtrller.getUserProfile);

  router.route('/user/follow').post(authMiddleware, userCtrller.followUser);

  router.route('/user').get(authMiddleware, userCtrller.getAllUser);

  router.route('/user').post(userCtrller.addUser);

  router.route('/user/signin').post(userCtrller.signIn);

  router.route('/user/signout').get(authMiddleware, userCtrller.signOut);

  router.route('/user/remove').get(authMiddleware, userCtrller.removeUser);

  router.route('/user/update').post(authMiddleware, userCtrller.updateProfile);
};

module.exports = userRouter;
