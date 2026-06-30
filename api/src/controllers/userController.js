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

async function createUser(req, res) {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'valid email is required' });
  }

  const user = await userService.createUser({ name: name.trim(), email: email.trim() });

  return res.status(201).json(user);
}

module.exports = { getUserById, createUser };
