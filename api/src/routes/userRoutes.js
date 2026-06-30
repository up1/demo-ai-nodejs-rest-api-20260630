'use strict';

const { Router } = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getUserById } = require('../controllers/userController');

const router = Router();

router.get('/users/:id', authenticate, getUserById);

module.exports = router;
