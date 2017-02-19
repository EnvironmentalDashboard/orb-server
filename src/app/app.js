/**
 * @overview Main application file; handles all bootstrapping
 * @author jeremyfifty9
 */

/**
 * Exteneral dependencies
 */

let dotenv = require('dotenv').config({
        path: "./config/orb-server.env"
    }),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    NodeCache = require('node-cache');

/**
 * Local dependencies
 */

let router = require('./components/router'),
    Service = require('../model/services'),
    hbsHelpers = require('./components/presentationhelpers'),
    routes = require('./config/routes.json');

/**
 * Configuration
 */
let app = express();

var options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_INTERMEDIATES),
};

https.createServer(options, app).listen(3000);

app.set('port', 3000);

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: './presentations/layouts',
    partialsDir: './presentations/partials',
    helpers: hbsHelpers
}));

app.set('view engine', '.hbs');
app.set('views', './presentations');

/**
 * Middleware
 */

// Enforce secure connection
app.use(function(req, res, next) {
    if (!req.secure) {
        return res.redirect(301, ['https://', req.get('host'), req.url].join(''));
    }

    next();
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Front-end resources
app.use(express.static('../public'));
app.use(express.static('../../bower_components'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/**
 * Routing
 */
router.import(routes, app);

/**
 * Orb instruction dispatching
 *

setInterval(function() {

    Service.OrbInstructionsDispatcher.dispatchAll();

}, 5000);*/
