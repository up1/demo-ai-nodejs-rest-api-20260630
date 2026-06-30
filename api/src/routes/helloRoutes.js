'use strict';

const { Router } = require('express');
const { getHello } = require('../controllers/helloController');

const router = Router();

router.get('/hello', getHello);

module.exports = router;
