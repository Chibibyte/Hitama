/**
 * Users specific routes
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const crud = require('./crud');
const gateway = require('./gateway');
const user = require('./user');

router.use('/user', user);

// api_0
router.post('/create', gateway(0), crud.create(User));
router.post('/read', gateway(0), crud.read(User));
router.post('/update', gateway(0), crud.update(User, ['_id']));
router.post('/delete', gateway(0), crud.delete(User));
router.post('/read_all', gateway(0), crud.read_all(User));
router.post('/read_many', gateway(0), crud.read_many(User));

// api_1
// NONE

module.exports = router;