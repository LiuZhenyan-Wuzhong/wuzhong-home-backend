const Category = require('../models/Category');

const categoryCtrller = {
  addCategory: (req, res, next) => {
    const { name } = req.body;

    Category.create({ name })
      .then((category) => {
        res.status(201).json(category.toObject());
        next();
      })
      .catch((err) => {
        res.status(403).json({ msg: err });
      });
  },

  getCategory: (req, res, next) => {
    const { _id } = req.body;

    Category.findById(_id).exec((err, category) => {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        res.json(category);
        next();
      }
    });
  },

  getAll: (req, res, next) => {
    Category.find().exec((err, categorys) => {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        res.json(categorys);
      }
    });
  }
};

module.exports = categoryCtrller;
