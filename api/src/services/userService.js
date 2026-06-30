'use strict';

const userModel = require('../models/userModel');

async function getUserById(id) {
  return userModel.findById(id);
}

module.exports = { getUserById };
