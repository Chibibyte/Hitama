/**
 * Handles all api-requests and offline request - testdata
 */
const testdata = require('./testdata/testdata.js');
const util = require('./util.js');

/**
 * Creates path object for real and fake api-calls.
 * see: @api_call
 * 
 * @param {String} path Api request path
 * @param {Object} testdata Testdata for offline testing
 */
function createApiPath(path, testdata) {
    return { path, testdata };
}

module.exports = { // read_self_group_task_data
    user: {
        register: createApiPath('/api/users/user/register', util.outputFilterInPlace(testdata.loginRegister, ['icon', '_id', 'name', 'email', 'createtAt', 'updatedAt'], true)),
        login: createApiPath('/api/users/user/login', util.outputFilterInPlace(testdata.loginRegister, ['icon', 'tasks', '_id', 'name', 'email', 'createtAt', 'updatedAt'], true)),
        logout: createApiPath('/api/users/user/logout', 'success'),
        readAllUsers: createApiPath('/api/users/user/read_all', util.outputFilterInPlace(testdata.users, ['icon', '_id', 'name'], true)),
        readAccount: createApiPath('/api/users/user/read_self', util.outputFilterInPlace(testdata.users[0], ['icon', '_id', 'name', 'email'], true)),
        updateAccount: createApiPath('/api/users/user/update_account', util.outputFilterInPlace(testdata.users[0], ['icon', '_id', 'name', 'email'], true)),
        deleteAccount: createApiPath('/api/users/user/delete_account', util.outputFilterInPlace(testdata.users[0], ['_id'], true)),
    },
    task: {
        delete: createApiPath('/api/tasks/task/delete', testdata.tasks[0]),
        update: createApiPath('/api/tasks/task/update', testdata.tasks[0]),
        updateSubtask: createApiPath('/api/tasks/task/update_subtask', testdata.tasks[1]),
        create: createApiPath('/api/tasks/task/create', testdata.tasks[0]),
        createSubtask: createApiPath('/api/tasks/task/create_subtask', testdata.tasks[1]),
        readAllTasks: createApiPath('/api/tasks/task/read_roottasks_data', util.outputFilterInPlace(testdata.tasks, ['icon', '_id', 'public', 'title', 'owner', 'createdAt', 'updatedAt', 'complete'], true)),
        read: createApiPath('/api/tasks/task/read', testdata.tasks[2]),
        readPublic: createApiPath('/api/tasks/task/read_public_task', testdata.tasks[1]),
        readSubtasksData: createApiPath('/api/tasks/task/read_subtasks_data', util.outputFilterInPlace(testdata.tasks, ['icon', '_id', 'public', 'title', 'owner', 'createdAt', 'updatedAt', 'complete'], true)),
        readSelfGroupTaskData: createApiPath('/api/tasks/task/read_self_group_task_data', util.outputFilterInPlace(testdata.tasks, ['icon', '_id', 'public', 'title', 'owner', 'createdAt', 'updatedAt', 'complete'], true)),
        userInGroup: createApiPath('/api/tasks/task/userInGroup', true)
    },
    /**
     * 
     * @param {Object} pathObj Result path object of @createApiPath
     * @param {Array} data Request data objects {name, value}. Every entry 
     * should represent a field in a mongoDB document 
     */
    api_call: async function (pathObj, data = []) {
        // check if testmode 'testdata'
        if (global.hitama.testmodes.testdata) {
            // fake api_call response data
            return pathObj.testdata;
        }
        let body = new FormData();
        function stringify(v) {
            if (Array.isArray(v)) return JSON.stringify(v);
            return v;
        }
        data.forEach(d => body.append(d.name, stringify(d.value)));
        try {
            let fRes = await fetch(pathObj.path, { method: "post", body });
            let contentType = fRes.headers.get('Content-Type');
            let rData;
            if (fRes.status !== 200) {
                if (contentType.includes('application/json')) {
                    rData = await fRes.json();
                } else rData = await fRes.text();
                console.error(rData);
                if (rData.dbError) return rData;
                return false;
            }
            rData = await fRes.json();
            return rData;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
