let dotenv = require('dotenv').config({path: './config/orb-server.env'}),
    express = require('express'),
    session = require('express-session'),
    http = require('http'),
    fs = require('fs'),
    exec = require('child_process').exec,
    router = require('express-promise-router')();

let Service = require('./model/services'),
    cache = require('./lib/cache');

let app = express();

http.createServer(app).listen(4000);

app.set('port', 4000);

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true
}));

/**
 * Sandbox
 */

cache.set('blah', 'woot');

router.get('/', function(req, res) {
    console.log('Handle 1');
    return Promise.resolve();
}, function(req, res) {
    console.log('Handle 2');
    res.send('woot');
});

app.use(router);
