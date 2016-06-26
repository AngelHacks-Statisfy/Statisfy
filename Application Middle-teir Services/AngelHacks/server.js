'use strict';
/** @module server */


/** Modules import */
var config = require('config');
var url = require('url');


/** Local Imports */
var logManager = require('./utils/log-manager.js');
var dataProcessor = require('./server/dataProcessor.js');
var server = require('./app.js');
var utils = require('./utils/utils.js');

/** Global Vars */
var HOST = config.ENV.HOST;
var PORT = config.ENV.PORT;
var logger = logManager.getLogger();

server.listen(PORT, HOST, function () {
    logger.info('[server] server started');
    logger.info('[server] Started development server...');
    logger.info('[server] Listening at http://' + HOST + ':' + PORT);

    server.emit('started');

    utils.testDBConnection();
});

server.on('error', function () {
    utils.recordErrors(new Error('Error'), 'Error starting server');
    return;
});

process.on('SIGTERM', function () {
    logger.info('[server] Received SIGTERM command');
    server.close();
    server.kill();
    process.kill();
});

process.on('uncaughtException1', function (err) {
    logger.info('[server] Encountered uncaught exception', err);
    server.kill();
    process.kill();
});
