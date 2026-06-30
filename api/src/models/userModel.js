'use strict';

const pool = require('../utils/db');

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create({ id, name, email, created_at }) {
  const { rows } = await pool.query(
    `INSERT INTO users (id, name, email, created_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, created_at`,
    [id, name, email, created_at]
  );
  return rows[0];
}

module.exports = { findById, create };
