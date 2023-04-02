const categoryCtrller = require('../controllers/category.ctrl');

const categoryRouter = (router) => {
    router.route('/category').get(categoryCtrller.getAll);
};

module.exports = categoryRouter;
