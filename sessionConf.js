const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const {
    NODE_ENV = 'development',
    SESS_SECRET = "superPrivateSecret_sjsfkep0asm0ea948t4",
} = process.env
const IN_PROD = NODE_ENV === 'production';

module.exports = {
    session(connection) {
        return {
            store: new MongoStore({ mongooseConnection: connection }),
            secret: SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: IN_PROD }
        }
    }
};