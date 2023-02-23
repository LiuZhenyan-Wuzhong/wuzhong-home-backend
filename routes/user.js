/*
 * @Author:
 * @Date: 2023-02-22 00:57:35
 * @LastEditors:
 * @LastEditTime: 2023-02-23 21:55:28
 * @Description:
 */
const userCtrller = require('../controllers/user.ctrl');

const userRouter = (router) => {
    router.route('/user/:id').get(userCtrller.getUser);

    router.route('/user/profile/:id').get(userCtrller.getUserProfile);

    router.route('/user').post(userCtrller.addUser);

    router.route('/user/follow').post(userCtrller.followUser);
};

module.exports = userRouter;
