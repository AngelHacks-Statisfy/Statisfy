'use strict';

/** @module server/dataProcessor.js */

/** Modules import */
var config = require('config');


/** Local Imports */
var db = require('./db/db.js');
var aws = require('./../server/lib/aws.js');
var logManager = require('../utils/log-manager.js');

/** Global Vars */
var logger = logManager.getLogger();


/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** -------------------------------------------         RULES                                     -------------------------------------------------- */

/**
 * Updating Rules
 * @param ruleId
 * @param rules
 * @param cb
 */
function updateRules(ruleId, rules, cb) {
    logger.info('[data processor] Updating Rules');
    db.updateRules(ruleId, rules, function (err, data) {
        if(err) {
            return cb(err, null);
        }
        cb(null, data);
    });
}

/**
 * Fetching rule by Id
 * @param ruleId
 * @param cb
 */
function fetchRuleById(ruleId, cb) {
    logger.info('[data processor] Fetching Rules by Id');
    db.fetchRuleById(ruleId, function (err, data) {
        if(err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}

/**
 * Fetch all rules
 * @param cb
 */
function fetchAllRules(cb) {
    db.fetchAllRules(function (err, data) {
        if (err) {
            return cb(err, null);
        }
        cb(null, data);
    });
}

function fetchAllProviders(cb) {
    db.fetchAllProviders(function (err, data) {
        if (err) {
            return cb(err, null);
        }
        cb(null, data);
    });
}

exports.updateRules = updateRules;
exports.fetchRuleById = fetchRuleById;
exports.fetchAllRules = fetchAllRules;
exports.fetchAllProviders = fetchAllProviders;