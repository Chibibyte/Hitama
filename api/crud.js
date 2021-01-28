/**
 * Basic CRUD-operations, -errorhandling, -filtering and content-checks
 */
const mongoose = require('mongoose');
const util = require('./util');

/**
 * contains debug options from conf.js
 */
let { debug } = process.api;

let crud = {};
crud.methods = {};
crud.dataChecks = {
    task: {},
    user: {}
};

/**
 * Filters entries from @obj .
 * If @whitelist is set, names becomes whitelist,
 * else names is a blacklist.
 * If @obj is a mongoose result object, obj._doc will be
 * filtered instead of @obj .
 * 
 * @param {Object} obj Object to filter
 * @param {Array} names Names of object values to remove/keep
 * @param {Boolean} whitelist If set, names becomes whitelist,else blacklist
 */
function objectFilter(obj, names, whitelist = false) {
    let workable = obj._doc ? obj._doc : obj;
    let useNames = names;
    if (whitelist) useNames = Object.keys(workable).filter(key => !names.includes(key));
    useNames.forEach(name => delete workable[name]);
}

/**
 * Filter for api-request input data.
 * 
 * @param {Object} data crud request input
 * @param {Array} names @objectFilter
 * @param {Array} whitelist @objectFilter
 */
function inputFilter(data, names, whitelist = false) {
    let innerNames = ['createdAt', 'updatedAt', ...names];
    let fData = data.rest ? data.rest : data;
    objectFilter(fData, innerNames, whitelist);
}

/**
 * Filter for api-request output data.
 * 
 * @param {Object} data crud request output
 * @param {Array} names @objectFilter
 * @param {Array} whitelist @objectFilter
 */
function outputFilter(data, names, whitelist = false) {
    let innerNames = [...names];
    if (Array.isArray(data)) data.forEach(d => {
        objectFilter(d, innerNames, whitelist);
    });
    else objectFilter(data, innerNames, whitelist);
}

/**
 * Stores @modelCb in @crud object, or a debug function
 * for request paths, if process.api.debug is set.
 * 
 * @param {String} name Function name
 * @param {Function} modelCb Function that accepts a MongoDB-Model and custom options
 */
function apiFunc(name, modelCb) {
    crud[name] = modelCb;
    if (debug.paths) crud[name] = () => {
        return (req, res) => {
            let debugMsg = "request: " + name;
            res.send(debugMsg);
        }
    }
}

/**
 * Creates a wrapper function around a basic mongoose crud function @fct .
 * Handles input/output-filtering, data-checks, error handling ,
 * preparation of request data and sending the result data
 * 
 * @param {Function} dataPrep Function that prepares api-request input data
 * @param {Function} fct Function that makes a mongoose call with given model and @dataPrep result data
 */
function crudFunc(dataPrep = data => data, fct) {
    return (model, options = {}) => {
        return async (req, res) => {
            let { blacklistIn, blacklistOut, whitelistIn, whitelistOut, dataChecks } = options;
            return await util.tryAwaitHandling(res, async () => {
                // get data from req
                let inputData;
                try {
                    inputData = dataPrep(req);
                } catch (e) {
                    throw (e);
                }

                // filter input
                if (blacklistIn) inputFilter(inputData, blacklistIn);
                if (whitelistIn) inputFilter(inputData, whitelistIn, true);

                // crud op
                let data = await fct(model, inputData);

                // checks on data (e.g. access checks, public, private, ...)
                await runDataChecks(dataChecks, data, req);

                // filter output
                if (blacklistOut) outputFilter(data, blacklistOut);
                if (whitelistOut) outputFilter(data, whitelistOut, true);

                // return or send data
                if (res) return res.send(data);
                return data;
            });
        }
    }
}

/**
 * Error class for Crud related errors
 */
class CrudError extends Error {
    constructor(msg, value) {
        super(msg);
        this.errors = {};
        this.errors.dbError = { message: msg, name: 'CrudError', value };
    }
}

/**
 * Helper for creating an dataCheck object
 * 
 * @param {Function} check checks input data
 * @param {String} msg Message on check failure
 */
function createDataCheck(check, msg) {
    return { check, msg }
}

/**
 * Checks users read and write access to task.
 * Returns { write, read } object, containing the boolean values.
 * 
 * @param {String} taskId Id of Task
 * @param {String} userId Id of User
 * 
 * @returns {Object} { write, read } boolean access values
 */
async function userHasAccess(taskId, userId) {
    let td = await mongoose.models.Task.findById(taskId);

    function writeRead(write, read = true) {
        return { write, read };
    }
    let read = td.public;

    // is owner of task 
    if (td.owner == userId) return writeRead(true);

    // is in group of task 
    if (td.group.includes(userId)) read = true;

    // task is root AND public
    if (td.parent == null && td.public) return writeRead(false, true);
    // task is root and NOT public
    if (td.parent == null && !td.public) return writeRead(false, read);

    // task is not root
    let parentCheck = await userHasAccess(td.parent, userId);
    parentCheck.read = parentCheck.read && read;

    return parentCheck;
}


// ################################################ DATACHECKS ################################################

crud.dataChecks.task.notPublic = createDataCheck(data => (data.public), 'Task is not public');
crud.dataChecks.task.notRoot = createDataCheck(data => (data.parent == null), 'Task not root');
crud.dataChecks.task.notPublicSub = createDataCheck(async (data, req) => {
    let { userId } = req.session;
    let hasAccess = await userHasAccess(data._id, userId);
    return hasAccess.read;
}, 'Parent task is not public');

crud.dataChecks.task.userNotHigherUp = createDataCheck(async (data, req) => {
    let { userId } = req.session;
    let hasAccess = await userHasAccess(data._id, userId);
    return hasAccess.write;
}, 'Ask owner or higher up');

/**
 * Runs all checks in @dataChecks and throws @CrudError on failure
 * 
 * @param {Array} dataChecks dataCheck objects to check
 * @param {Object} data Data to check
 * @param {Object} req 
 */
async function runDataChecks(dataChecks, data, req) {
    if (!dataChecks) return true;
    for (let i = 0; i < dataChecks.length; i++) {
        if (data && !(await dataChecks[i].check(data, req))) throw new CrudError(dataChecks[i].msg);
    }
    return true;
}

/**
 * Helper for minimal request data preperation.
 * 
 * @param {Object} req 
 */
function idFilesBody(req) {
    let { _id, ...rest } = req.body;
    if (req.files) rest.icon = req.files.icon;
    return { _id, rest };
}

/**
 * Generic create function
 */
apiFunc('create', crudFunc(
    req => idFilesBody(req).rest,
    async (model, data) => await model.create(data)));

/**
* Generic read function
*/
apiFunc('read', crudFunc(
    req => {
        if (!req.body._id) throw new CrudError('Missing id');
        return req.body._id;
    },
    async (model, data) => await model.findById(data)));

/**
 * Generic update function
 */
apiFunc('update', crudFunc(
    req => {
        let ifb = idFilesBody(req);
        if (!ifb._id) throw new CrudError('Missing id');
        return ifb;
    },
    async (model, data) => {
        let inst = await model.findById(data._id);
        util.jsonParseObject(inst, data.rest);
        return await inst.save({ validateModifiedOnly: true });
    }));

/**
 * Generic delete function
 */
apiFunc('delete', crudFunc(
    req => {
        if (!req.body._id) throw new CrudError('Missing id');
        return req.body._id;
    },
    async (model, data) => {
        let inst = await model.findById(data);
        return inst.remove();
    }));

/**
 * Generic read_all function
 */
apiFunc('read_all', crudFunc(undefined, async (model) => await model.find({})));

/**
 * Generic read_many function
 */
apiFunc('read_many', crudFunc(
    req => {
        let _ids = req.body._ids;
        if (!_ids || _ids.length == 0) throw new CrudError('Missing ids');
        let ids = [];
        if (typeof _ids === 'string') _ids = JSON.parse(_ids);
        _ids.forEach(_id => ids.push(mongoose.Types.ObjectId(_id)));
        if (!Array.isArray(_ids)) throw new CrudError('_ids must be of type array');
        return ids;
    },
    async (model, data) => await model.find({ '_id': { $in: data } })));

/**
 * User specific Tasks: find where user is in group of task
 */
apiFunc('read_self_group_task_data', crudFunc(
    req => {
        if (!req.body._id) throw new CrudError('Missing id');
        return req.body._id;
    },
    async (model, data) => {
        let arr = await model.find({
            $expr: {
                $in: [mongoose.Types.ObjectId(data), "$group"]
            }
        });
        return arr;
    }));

crud.apiFunc = apiFunc;
crud.CrudError = CrudError;
crud.createDataCheck = createDataCheck;
crud.outputFilter = outputFilter;
crud.inputFilter = inputFilter;
crud.userHasAccess = userHasAccess;

module.exports = crud;