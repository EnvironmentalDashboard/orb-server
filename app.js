/**
 * @overview Main application file; handles all bootstrapping
 */

/**
 * Dependencies
 */

let express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    dbconfig = require('./config/db'),
    dbconnect = require('./lib/dbconnect')(dbconfig),
    routes = require('./routes'),
    controllers = require('./controllers');


var app = express();

/**
 * App configuration
 */

http.createServer(app).listen(3000);

app.set('port', 80);

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: './views/layouts'
}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.use(session({
    secret: 'secret'
}));

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/**
 * Routing
 */

routes.setup({
    controllers: controllers,
    app: app
});
