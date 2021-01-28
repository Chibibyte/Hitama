/**
 * Simple Gateway for basic access right handling before api
 * Api-User-Types: Gateway, Owner, Group, User, Other
 * Left has all rights types further right have
 * # # # #
 * @Gateway : This server
 * @Owner : Owns task in request
 * @Group : Is in group of task in request
 * @User : Basic, logged in User
 * @Other : Normal, NOT logged in user
 */
const util = require("./util");
const User = require('../models/User.js');
const Task = require('../models/Task.js');
const crud = require('./crud');


const api_levels = [
    { name: 'Gateway', msg: 'You are not the gateway' },
    { name: 'Owner', msg: 'Ask the owner of this file' },
    { name: 'Group', msg: 'You are not in this group' },
    { name: 'User', msg: 'Are you logged in?' },
    { name: 'Other', msg: 'Anyone can get this permission.' }
]


/**
 * Creates api_level specific api errors
 * 
 * @param {Object} res 
 * @param {Int} api_level Api-access level. Lower api-level means higher access level.
 */
function sendApiLevelError(res, api_level) {
    util.sendApiError(res, 'gateway', 'denied', `${api_levels[api_level].msg}`);
}

/**
 * Basic user session authentication
 * 
 * @param {Object} req 
 */
function auth(req) {
    if (process.api.debug.crud) return true;
    return (req.session && req.session.userId);
}

/**
 * Checks to run on corresponding api-level
 */
let checksArr = [];

// Gateway
checksArr[0] = [() => false];

// Owner
checksArr[1] = [
    async (req) => {
        if (process.api.debug.crud) return true;
        let userId = req.session.userId;
        let taskId = req.body._id;
        if (!userId || !taskId) return false;
        let task = await Task.findById(taskId);

        let check = (task && task.owner == userId);

        // check if boss
        if (!check) check = await crud.dataChecks.task.userNotHigherUp.check(task, req);
        return check;
    }
]

// Group
checksArr[2] = [
    async (req) => {
        if (process.api.debug.crud) return true;
        let userId = req.session.userId;
        let taskId = req.body._id;

        if (!userId || !taskId) return false;
        let task = await Task.findById(taskId);

        // check if owner or group
        let check = (task && (task.group.includes(userId) || task.owner == userId))

        // check if boss
        if (!check) check = await crud.dataChecks.task.notPublicSub.check(task, req);

        return check;
    }
]

// User
checksArr[3] = [auth]

// Other
checksArr[4] = [() => true];

/**
 * Runs all checks up to @api_level, to check if user
 * can get required permission
 * 
 * @param {Int} api_level 
 * @param {Object} req 
 */
async function runChecks(api_level, req) {
    if (process.api.debug.gateway) console.log("checking api_level:", api_level);
    for (let i = checksArr.length - 1; i >= api_level; i--) {
        for (let j = 0; j < checksArr[i].length; j++) {
            const ch = checksArr[i][j];
            let chData = await ch(req);
            if (!chData) {
                if (process.api.debug.gateway) console.log("failed at api_level:", i);
                return false;
            }
        }
    }
    return true;
}

/**
 * Full Gateway checks
 */
const checks = [];

/**
 * Wrapper for level based api checks.
 * Includes errorhandling, input overrides (e.g. userId from req.session)
 * and responding to requests.
 * Stores extended @checksArr function in @checks
 * 
 * @param {Int} api_level
 */
function addGateCheck(api_level) {
    checks.push((inputOverride) => {
        return async (req, res, next) => {
            if (inputOverride) {
                inputOverride.forEach(sw => {
                    // if type function, call function
                    let swType = typeof sw[1];
                    req.body[sw[0]] = (swType == 'function') ? sw[1](req) : sw[1];
                });
            }

            if (await runChecks(api_level, req)) {
                next();
            } else sendApiLevelError(res, api_level);
        }
    })
}


// #################################    GATE CHECKS    #################################

addGateCheck(0);
addGateCheck(1);
addGateCheck(2);
addGateCheck(3);
addGateCheck(4);

/**
 * Returns extended apiLevel based check function that can 
 * override the input with @inputOverride
 * 
 * @param {Int} apiLevel 
 * @param {Array} inputOverride overrides, that are either values or (req)-functions 
 * that return an override value
 */
function gateway(apiLevel, inputOverride) {
    return checks[apiLevel](inputOverride);
}


module.exports = gateway;