'use strict';

const { randomUUID } = require('crypto');
const userModel = require('../models/userModel');
const rabbitmq = require('../utils/rabbitmq');

async function getUserById(id) {
  return userModel.findById(id);
}

async function createUser({ name, email }) {
  const id = randomUUID();
  const created_at = new Date().toISOString();

  const user = await userModel.create({ id, name, email, created_at });

  await rabbitmq.publishMessage({
    message_type: 'user_created',
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  });

  return user;
}

module.exports = { getUserById, createUser };
