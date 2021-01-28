/**
 * Single User specific routes
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const crud = require('./crud');
const util = require('./util');
const gateway = require('./gateway');
const bcrypt = require('bcrypt');

class LoginError extends crud.CrudError {
    constructor(msg, value) {
        super(msg, value);
        this.errors.dbError.name = 'LoginError';
    }
}

const selfWhitelistOut = ['_id', 'name', 'email', 'createdAt', 'updatedAt', 'icon', 'tasks'];

// api_0
// NONE

// api_1
// NONE

// api_2
// NONE

// api_3
router.post('/read_self', gateway(3, [['_id', req => req.session.userId]]), crud.read(User, { whitelistOut: selfWhitelistOut }));
router.post('/update_account', gateway(3, [['_id', req => req.session.userId]]), crud.update(User, { whitelistOut: selfWhitelistOut }));
router.post('/delete_account', gateway(3, [['_id', req => req.session.userId]]), crud.delete(User, { whitelistOut: ['_id'] }));
router.post('/read_all', gateway(3, [['_id', req => req.session.userId]]), crud.read_all(User, { whitelistOut: ['_id', 'name', 'icon'] }));

// api_4
router.post('/register', gateway(4), crud.create(User, { blacklistIn: ['tasks'], whitelistOut: selfWhitelistOut }));
router.post('/login', gateway(4),
    (req, res) => util.tryAwaitHandling(res, async () => {
        let { name, password } = req.body;
        if (!name) throw new LoginError('Missing name');
        if (!password) throw new LoginError('Missing password');
        let user = await User.findOne({ name });
        if (!user) throw new LoginError('User not found');
        let pwCompare = await bcrypt.compare(password, user.password);
        if (pwCompare) {
            crud.outputFilter(user, selfWhitelistOut, true);
            req.session.userId = user._id;
            return res.send(user);
        }
        throw new LoginError('Wrong password');
    })
);
router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.send({ msg: 'success' });
});

module.exports = router;