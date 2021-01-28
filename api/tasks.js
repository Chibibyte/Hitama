/**
 * Tasks specific routes
 */
const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');
const crud = require('./crud');
const gateway = require('./gateway');
const task = require('./task');

router.use('/task', task);

// api_0
router.post('/create', gateway(0), crud.create(Task));
router.post('/read', gateway(0), crud.read(Task));
router.post('/update', gateway(0), crud.update(Task, ['_id']));
router.post('/delete', gateway(0), crud.delete(Task));
router.post('/read_all', gateway(0), crud.read_all(Task));
router.post('/read_many', gateway(0), crud.read_many(Task));

// api_1
// NONE

module.exports = router;