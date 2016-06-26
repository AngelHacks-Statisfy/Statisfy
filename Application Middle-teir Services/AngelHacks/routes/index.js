'use strict';

/** @module routes/index
 * This is the root of all the types of api routers.
 * for Example:- If we want all the calls starting with /api to redirect to apiRouter
 * For version changes/admin api this will be easier than making changes than making change at million places.
 */

var apiRouter = require('./api.js');

var setup = function (app) {
    app.use('/api/v1', apiRouter);
};

exports.setup = setup;
