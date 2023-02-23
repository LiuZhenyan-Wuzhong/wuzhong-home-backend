/*
 * @Author:
 * @Date: 2023-02-22 01:37:36
 * @LastEditors:
 * @LastEditTime: 2023-02-22 01:39:13
 * @Description:
 */
const user = require('./user');
const article = require('./article');

const indexRouter = (router) => {
    user(router);
    article(router);
};

module.exports = indexRouter;
