'use strict';

const express = require('express');
const helloRoutes = require('./routes/helloRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use('/api', helloRoutes);
app.use('/api', userRoutes);

// Global error handler — catches async errors forwarded by Express 5
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
