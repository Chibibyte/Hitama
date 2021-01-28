/**
 * Single Task specific routes
 */
const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');
const crud = require('./crud');
const gateway = require('./gateway');

const dchecks = crud.dataChecks.task;
const tableWhitelistOut = ['title', 'icon', 'group', 'public', 'owner', 'createdAt', 'updatedAt', '_id', 'complete'];

// api_0
// NONE

// api_1
router.post('/update', gateway(1), crud.update(Task, { blacklistIn: ['tasks'] }));
router.post('/delete', gateway(1, [['owner', req => req.session.userId]]), crud.delete(Task));
router.post('/update_subtask', gateway(1), crud.update(Task, { blacklistIn: ['tasks'] }));
router.post('/delete_subtask', gateway(1, [['owner', req => req.session.userId]]), crud.delete(Task));


// api_2
router.post('/read_subtask', gateway(2), crud.read(Task));
router.post('/create_subtask',
    gateway(2, [['owner', req => req.session.userId]]),
    (req, res, next) => {
        if (!req.body._id) throw new crud.CrudError('Missing _id');
        req.body.parent = req.body._id;
        next();
    },
    crud.create(Task));

router.post('/read', gateway(2, [['userId', req => req.session.userId]]), async (req, res, next) => {
    let readRes = await crud.read(Task)(req);
    let checkRes = await crud.userHasAccess(req.body._id, req.session.userId);
    readRes._doc.access = checkRes;
    res.send(readRes);
});

// api_3 read_self_group_task_data
router.post('/read_self_group_task_data', gateway(3, [['_id', req => req.session.userId]]), crud.read_self_group_task_data(Task, { whitelistOut: tableWhitelistOut }));
router.post('/create', gateway(3, [['owner', req => req.session.userId]]), crud.create(Task));

router.post('/read_roottasks_data', gateway(3),
    async (req, res) => {
        // get task for subtasks
        let taskData = await crud.read_all(Task)(req);
        if (!taskData) {
            res.status(500);
            return res.send('ServerError');
        }
        if (taskData.dbError) {
            res.status(401);
            return res.send(taskData);
        }

        // get roottask
        let roottasks = [];
        taskData.forEach(td => {
            if (td.parent === null) {
                roottasks.push(td);
            }
        })

        // filter output data
        crud.outputFilter(roottasks, tableWhitelistOut, true);
        res.send(roottasks);
    })


router.post('/read_public_task', gateway(3), crud.read(Task, { dataChecks: [dchecks.notPublic, dchecks.notPublicSub] }));
router.post('/read_subtasks_data', gateway(3),
    async (req, res) => {
        // get task for subtasks
        let taskData = await crud.read(Task, { dataChecks: [dchecks.notPublicSub] })(req);
        if (!taskData) {
            res.status(500);
            return res.send('ServerError');
        }
        if (taskData.dbError) {
            res.status(401);
            return res.send(taskData);
        }

        // get subtasks
        if (!taskData.tasks || taskData.tasks.length === 0) return res.send([]);
        req.body._ids = taskData.tasks;
        let out = await crud.read_many(Task)(req);
        crud.outputFilter(out, tableWhitelistOut, true);
        res.send(out);
    })
router.post('/userInGroup', gateway(3), async (req, res) => {
    let taskData = await crud.read(Task)(req);
    if (!taskData) {
        res.status(500);
        return res.send('ServerError');
    }
    if (taskData.group && taskData.group.includes(req.session.userId)) return res.send({ msg: true });
    res.send({ msg: false });
});

module.exports = router;