/**
 * Testdata for fake api-calls
 * Without real api-calls, npm run serve is enough, no build required
 */
let testdata = {};
testdata.tasks = [];
testdata.users = [];
testdata.loginRegister = {
    _id: "userId",
    name: "DefaultBob",
    email: "a@b.c",
    password: "1234"
}

function createTestTask(skipPush = false, complete = false) {
    let nr = testdata.tasks.length;
    let task = {
        icon: require(`@/assets/logo.png`),
        title: `test_title_${nr}`,
        description: 'test_description',
        tasks: [],
        group: ["_id_2", "_id_4", "_id_5"],
        public: false,
        complete,
        parent: "parent",
        createdAt: "2021-01-19T10:14:43.874Z",
        updatedAt: "2021-01-19T10:14:43.874Z",
        owner: `_id_${nr}`,
        _id: `_id_${nr}`,
        onclick: () => {},
    }
    if (!skipPush) {
        task.tasks.push(createTestTask(true)),
            task.tasks.push(createTestTask(true, true)),
            task.tasks.push(createTestTask(true))
    }
    if (!skipPush) testdata.tasks.push(task);
    return task;
}

function createTestUser() {
    let nr = testdata.users.length;
    let user = {
        icon: require(`@/assets/logo.png`),
        name: `user_${nr}`,
        email: `email@b.c_${nr}`,
        _id: `_id_${nr}`,
        onclick: () => {},
    }
    testdata.users.push(user);
    return user;
}

createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();
createTestUser();

createTestTask();
createTestTask(false, true);
createTestTask();
createTestTask();

module.exports = testdata;