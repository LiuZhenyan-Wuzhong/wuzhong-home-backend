/*
 * @Author:
 * @Date: 2023-02-22 00:49:51
 * @LastEditors:
 * @LastEditTime: 2023-02-22 00:51:31
 * @Description:
 */
const articleCtrller = require('./../controllers/article.ctrl');
const multipart = require('connect-multiparty');
const multipartWare = multipart();

const articleRouter = (router) => {
    router.route('/article/list').get(articleCtrller.getAll);

    router.route('/article').post(multipartWare, articleCtrller.addArticle);

    router.route('/article/clap').post(articleCtrller.clapArticle);

    router.route('/article/comment').post(articleCtrller.commentArticle);

    router.route('/article/:id').post(articleCtrller.getArticle);
};

module.exports = articleRouter;
