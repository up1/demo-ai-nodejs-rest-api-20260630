'use strict';

const { Router } = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getUserById, createUser } = require('../controllers/userController');

const router = Router();

router.post('/users', createUser);
router.get('/users/:id', authenticate, getUserById);

module.exports = router;
