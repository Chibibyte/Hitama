const conf = require('./conf.js');
const sessionConf = require('./sessionConf.js');
const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const api = require('./api/api.js');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();


// #########################################    SERVER    #########################################   
let { host, port } = process.env;
app.listen({ host, port }, () => console.log('listening on ', host, port));



// #########################################    DATABASE    #########################################    
mongoose.connect('mongodb://localhost/hitama', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })



// #########################################    MIDDLEWARE    #########################################  
app.use(session(sessionConf.session(mongoose.connection)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/api', (req, res, next) => {
    next();
}, api);



// #########################################    STATIC CONTENT   #########################################   
app.use('/db_public', express.static(path.resolve(__dirname, 'files/public/db_public')));
app.use('/res', express.static(path.resolve(__dirname, 'res')));
app.use(express.static(path.resolve(__dirname, 'hitama/dist')));

// #########################################    404   #########################################  
app.get('*', (req, res) => res.redirect('/'));