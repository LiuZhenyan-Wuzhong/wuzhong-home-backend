const tagCtrller = require('../controllers/tag.ctrl');

const tagRouter = (router) => {
    router.route('/tag').get(tagCtrller.getAll);
};

module.exports = tagRouter;
