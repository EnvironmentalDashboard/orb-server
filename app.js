/**
 * @overview Main application file; handles all bootstrapping
 * @author jeremyfifty9
 */

/**
 * Exteneral dependencies
 */

let dotenv = require('dotenv').config({path: "./config/orb-server.env"}),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    http = require('http');

/**
 * Local dependencies
 */

let controllers = require('./controllers'),
    views = require('./views'),
    routes = require('./routes');

/**
 * App configuration
 */

let app = express();

http.createServer(app).listen(3000);

app.set('port', 80);

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: './presentations/layouts'
}));

app.set('view engine', '.hbs');
app.set('views', './presentations');

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('./public'));
app.use(express.static('./bower_components'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/**
 * Routing
 */

let routerParams = {
    controllers: controllers,
    views: views,
    app: app
};

routes.setup(routerParams);
