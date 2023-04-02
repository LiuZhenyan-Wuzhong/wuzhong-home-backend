const Tag = require('../models/Tag');

const tagCtrller = {
  addTag: (req, res, next) => {
    const { name } = req.body;

    Tag.create({ name })
      .then((tag) => {
        res.status(201).json(tag.toObject());
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(403).json({ msg: err });
      });
  },

  getTag: (req, res, next) => {
    const { _id } = req.body;

    Tag.findById(_id).exec((err, tag) => {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        res.json(tag);
        next();
      }
    });
  },

  getAll: (req, res, next) => {
    Tag.find().exec((err, tags) => {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        res.json(tags);
        next();
      }
    });
  }
};

module.exports = tagCtrller;
