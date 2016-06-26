'use strict';
/** @module routes/api-route-handlers/index.js */

exports.rulesApi = require('./rules-api-handler');

exports.apiroot = function (req, res) {
    res.jsend.success({
        apiVersion: 1
    });
};
