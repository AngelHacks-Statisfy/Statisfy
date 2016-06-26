/**
 * The app.js file does all the bootstrapping by require-ing all the controllers, models and middlewares.
 * We can break the app.js into 3 parts. Bootstrapping
 * Controllers (./app/controllers/) :- The controller files contain the routes, routing middlewares, business logic, template rendering and dispatching.
 */

/** Modules import */
var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    VitalSigns = require('vitalsigns'),
    routes = require('./routes/'),
    jsend = require('jsend'),
    vitals = new VitalSigns();


/** Global Vars */
var cors = require('cors'),
    util = require('util'),
    app = express();

/** Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('combined'));
app.use(jsend.middleware);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/static/views');

/** setup routes */
routes.setup(app);

/** Vitals */
vitals.monitor('cpu');
vitals.monitor('mem', {units: 'MB'});
vitals.monitor('tick');
vitals.unhealthyWhen('cpu', 'usage').equals(100);
vitals.unhealthyWhen('tick', 'maxMs').greaterThan(500);
vitals.on('healthChange', function (healthy, failedChecks) {
    console.log('Server is ' + (healthy ? 'healthy' : 'unhealthy') +
        '.  Failed checks:', failedChecks);
});

app.get('/health', vitals.express);

app.on('started', function () {
    /** server running and listening for requests */
});

module.exports = app;
