'use strict';

/** @module server/db/db.js */

/** Modules import */
var timestamp = require('unix-timestamp');
var config = require('config');

/** Local Imports */
var utils = require('./../../utils/utils.js');
var constants = require('./../../secret/constants.js');
var logManager = require('../../utils/log-manager.js');

/** Global Vars */
var logger = logManager.getLogger();
var DynamoDB = require('aws-dynamodb')(config.AWS_CONFIG);


/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** -------------------------------------------         GENERAL                                   -------------------------------------------------- */

/** every call to Amazon DynamoDB that fail will call this function before the operation's callback */
DynamoDB.on('error', function (operation, error, payload) {
    utils.recordErrors(error, ' Dynamodb ' + operation + ' Error');
    return;
    /** you could use this to log fails into LogWatch for later analysis or SQS queue lazy processing */
});

/**
 * Get the list of tables in DynamoDB.
 */
function getTablesList(cb) {
    logger.info('[db] fetching tables list');
    DynamoDB.client.listTables(function (err, data) {
        cb(err, data);
    });
}

/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** -------------------------------------------         RULES                                     -------------------------------------------------- */


/**
 * Updating Rules
 * @param ruleId
 * @param rules
 * @param cb
 */
function updateRules(ruleId, rules, cb){
    var queryBuilder = DynamoDB
        .table(config.DYNAMODB_CONFIG.ruleTableName) /** Table names are stored in yaml files */
        .where('rule_id').eq(ruleId)
        .return(DynamoDB.ALL_OLD);
    var params = [];
    if (rules) {
        params[constants.DEV_RULES_TABLE_COLUMNS.RULES] = rules;
    }
    queryBuilder.update(params, function (err, data) {
        return cb(err, data);
    });
}


/**
 * Fetch rules by ID.
 * @param ruleId
 * @param cb
 */
function fetchRuleById(ruleId, cb){
    var queryBuilder = DynamoDB
        .table(config.DYNAMODB_CONFIG.ruleTableName) /** Table names are stored in yaml files */
        .where('rule_id').eq(ruleId);
    queryBuilder
        .query(function (err, data) {
            return cb(err, data);
        });
}

/**
 * Getting all the rules
 * @param cb
 */
function fetchAllRules(cb){
    DynamoDB.table(config.DYNAMODB_CONFIG.ruleTableName)
        .scan (function (err, data) {
            if(err) {
                utils.recordErrors(err, utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
                cb(err, null);
            }
            cb(null, data);
        });
}

exports.getTablesList               = getTablesList;
exports.updateRules                 = updateRules;
exports.fetchRuleById               = fetchRuleById;
exports.fetchAllRules               = fetchAllRules;
