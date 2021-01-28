process.env.NODE_ENV = 'development';
process.env.port = '8080';
process.env.host = 'localhost';

process.api = {};
process.api.debug = {};
process.api.debug.paths = false;
process.api.debug.errors = false;
process.api.debug.gateway = false;
process.api.debug.crud = false;
process.api.debug.validationErrors = false;