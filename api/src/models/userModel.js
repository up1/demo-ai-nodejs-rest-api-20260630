'use strict';

const pool = require('../utils/db');

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

module.exports = { findById };
