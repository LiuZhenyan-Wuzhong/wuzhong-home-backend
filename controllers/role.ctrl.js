const Role = require('../models/Role');

const roleCtrller = {
  addRole: (req, res, next) => {
    const { name, value } = req.body;

    Role.create({ name, value })
      .then((role) => {
        res.status(201).json(role.toObject());
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(403).json({ msg: err });
      });
  },

  getRole: (req, res, next) => {
    const { _id } = req.body;

    Role.findById(_id).exec((err, role) => {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        next();
        res.json(role);
      }
    });
  },

  getAll: (req, res, next) => {
    Role.find().exec((err, roles) => {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        next();
        res.json(roles);
      }
    });
  }
};

module.exports = roleCtrller;
