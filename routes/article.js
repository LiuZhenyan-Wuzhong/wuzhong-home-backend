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
const authMiddleware = require('../middlewares/authMiddleware');

const articleRouter = (router) => {
    router.route('/article').get(authMiddleware, articleCtrller.getAll);

    router
        .route('/article/ids')
        .get(authMiddleware, articleCtrller.getAllArticleIds);

    router
        .route('/article/condition')
        .post(authMiddleware, articleCtrller.getConditionalArticles);

    router
        .route('/article')
        .post(authMiddleware, multipartWare, articleCtrller.addArticle);

    router
        .route('/article/:articleId')
        .get(authMiddleware, articleCtrller.getArticle);

    router
        .route('/article/clap')
        .post(authMiddleware, articleCtrller.clapArticle);

    router
        .route('/article/comment')
        .post(authMiddleware, articleCtrller.commentArticle);

    router
        .route('/article/comment/list')
        .post(authMiddleware, articleCtrller.getAllArticleComments);

    router
        .route('/article/comment')
        .delete(authMiddleware, articleCtrller.deleteComment);
};

module.exports = articleRouter;
