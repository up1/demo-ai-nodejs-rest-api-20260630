'use strict';

const userService = require('../services/userService');

async function getUserById(req, res) {
  const id = parseInt(req.params.id, 10);

  const user = await userService.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
}

module.exports = { getUserById };
