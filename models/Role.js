const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: String,
  value: String
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
