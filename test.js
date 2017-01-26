let dotenv = require('dotenv').config({path: './config/orb-server.env'}),
    express = require('express'),
    session = require('express-session'),
    https = require('https'),
    fs = require('fs'),
    exec = require('child_process').exec;

let Service = require('./model/services'),
    NodeCache = require('node-cache');

let app = express();

var options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_INTERMEDIATES),
};

app.use(function(req, res, next) {
    if(!req.secure) {
        return res.redirect(['https://', req.get('host'), req.url].join(''));
    }
    next();
});

https.createServer(options, app).listen(3000);

app.set('port', 3000);

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true
}));

/**
 * Sandbox
 */

let cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

let log = function(message, out) {
    out.push(message);
    console.log(message);
};

var out = [];

app.get('/', function(req, res, next) {
    out = [];

    if(req.session.authenticatedUser) {
        log('Already logged in ('+ req.session.authenticatedUser.email +'), resuming...', out);
        next();
    } else {
        log('Logging in...', out);

        Service.Recognition.login({
            email: 'jfeinst2@oberlin.edu',
            password: 'qweqwe'
        }, cache, req.session).then(function(){
            log(req.session.authenticatedUser ? 'Recognized ('+ req.session.authenticatedUser.email +')' : 'Client denied', out);
            next();
        }).catch(function (reason){
            log('ERROR: ' + reason, out);
            next();
        })
    }

}, function(req, res, next) {
    Service.DashboardInformation.initializeOrbList(cache, req.session).then(function() {
        if (cache.get('auth-error')) {
            log('Authorization error', out);
        } else if(cache.get('orb-list')) {
            log('Orb list successfully recieved from cache:', out);
            log(cache.get('orb-list'), out);
        } else {
            log('WARNING: Nothing stored in cache.', out);
        }

        return Promise.resolve();
    }).then(function() {
        res.send(out.join('<br>'));
    });
});
