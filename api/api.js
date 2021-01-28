/**
 * Root of api-routes
 */
const express = require('express');
const router = express.Router();
const util = require('./util');

const users = require('./users');
const tasks = require('./tasks');

router.use('/users', users);
router.use('/tasks', tasks);

router.use((req, res, next) => util.sendApiError(res, 'path', 'notfound', req.path))


module.exports = router;