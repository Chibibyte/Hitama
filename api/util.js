/**
 * Little helper functions/classes for the api
 */
const path = require('path');
const fs = require('fs');

let { debug } = process.api;
let apiErrors = {};
apiErrors.data = {};
apiErrors.path = {};
apiErrors.gateway = {};
apiErrors.gateway.denied = {
    msg: 'Permission denied',
    status: 401
}
apiErrors.data.missing = {
    msg: 'Missing data',
    status: 401
};
apiErrors.path.notfound = {
    msg: 'Request path not found',
    status: 401
}

/**
 * Copies all values from @source to @target, that are in @names or
 * all values, if @names is undefined.
 * 
 * @param {Object} target Object to copy to
 * @param {Object} source Object to copy from
 * @param  {...any} names Names of values to copy. Copies all if undefined
 */
function copyObj(target, source, ...names) {
    let _names = Object.keys(source);
    if (names.length > 0) _names = [...names];
    _names.forEach(name => target[name] = source[name]);
}

/**
 * Like @copyObj , but parses values with json before copy, if possible.
 * 
 * @param {Object} target Object that gets parse results
 * @param {Object} source Object to read from
 * @param  {...any} names Names of values to parse/copy. Copies all if undefined
 */
function jsonParseObject(target, source, ...names) {
    let _names = Object.keys(source);
    if (names.length > 0) _names = [...names];
    for (let i = 0; i < _names.length; i++) {
        const name = _names[i];
        let parsed = source[name];
        try {
            parsed = JSON.parse(source[name]);
        } catch (e) { }
        target[name] = parsed;
    }
}

/**
 * Runs async function @tryFct that is needed in an HttpRequest environment. Takes
 * care of errorhandling.
 * 
 * @param {Object} res HttpRequest response object
 * @param {Function} tryFct Async function to run and check for await errors
 */
async function tryAwaitHandling(res, tryFct) {
    try {
        return await tryFct();
    } catch (error) {
        if (res) res.status(401);

        if (error.errors) {
            let fullDbError = Object.values(error.errors)[0];
            let { name, message, value } = fullDbError;
            let dbError = { dbError: { name, message, value } };
            if (dbError.dbError.name == "ValidatorError" && process.api.debug.validationErrors) console.error("DATABASE_ERROR:", dbError.dbError);
            if (dbError.name == "CastError") {
                console.error(fullDbError);
                if (res) {
                    res.status(500);
                    return res.send('ServerError');
                }
                return false;
            }
            if (res) return res.send(dbError);
            return dbError;
        }

        console.error(error);
        if (res) {
            res.status(500);
            return res.send('ServerError');
        }
        return false;
    }
}

/**
 * @param {String} word Word to capitalize
 */
function capitalize(word) {
    return word[0].toUpperCase() + word.substring(1);
}

/**
 * Error class for Gateway related errors
 */
class GatewayError extends Error {
    constructor(msg, value) {
        super(msg);
        this.errors = {};
        this.errors.dbError = { message: msg, name: 'GatewayError', value };
    }
}

/**
 * Little extension and specilisation of @tryAwaitHandling
 * 
 * @param {Object} res 
 * @param {String} cat ApiError category
 * @param {String} type Type in @cat category
 * @param {String} suffix Error msg suffix
 */
function sendApiError(res, cat, type, suffix) {
    let { msg, status } = apiErrors[cat][type];
    debugErrors(msg);
    res.status(status);
    if (cat === 'gateway') return tryAwaitHandling(res, () => { throw new GatewayError(msg, suffix) })
    res.send(`${msg}: ${suffix}`);
}

/**
 * Stores file on @dirPath if possible. Is meant for FormData files.
 * 
 * @param {String} dirPath Path to directory
 * @param {File} ulFile File to store. Requires @name entry
 */
function dbStoreFile(dirPath, ulFile) {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(dirPath, { recursive: true });
        let ulFilePath = path.resolve(dirPath, ulFile.name);
        ulFile.mv(ulFilePath, (error) => {
            if (error) return reject(error);
            resolve(ulFilePath);
        });
    })
}

/**
 * Paths for file storage 
 */
const projectPath = path.resolve(__dirname, '..');
const filesPath = path.resolve(projectPath, 'files');
const publicFilesPath = path.resolve(filesPath, 'public');

/**
 * Stores images (icons) from create/updates api-calls
 * 
 * @param {Array} subDirs Path segmented in strings    
 * @param {File} icon File to store.
 */
function dbStoreIcon(subDirs, icon) {
    let dirArr = [publicFilesPath, ...subDirs, 'icon'];
    let iconDirPath = path.resolve(...dirArr);
    return dbStoreFile(iconDirPath, icon);
}

/**
 * Conditional debug log function
 * 
 * @param {String} name Name for what to log in debugging
 * @param {String} msg Debug log message
 */
function debugLog(name, msg) {
    if (debug[name]) console.error('debug:', name, ':', msg);
}

/**
 * @debugLog
 * 
 * @param {String} msg @debugLog
 */
function debugErrors(msg) {
    debugLog('errors', msg);
}



module.exports = {
    dbStoreFile,
    dbStoreIcon,
    debugErrors,
    sendApiError,
    projectPath,
    filesPath,
    publicFilesPath,
    tryAwaitHandling,
    copyObj,
    capitalize,
    jsonParseObject
}