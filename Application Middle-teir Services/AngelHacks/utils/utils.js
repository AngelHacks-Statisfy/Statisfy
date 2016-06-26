'use strict';
/** @module utils/utils.js */


/** Modules import */
var crypto = require('crypto');
var config = require('config');

/** Local Imports */
var db = require('./../server/db/db.js');
var constants = require('./../secret/constants.js');
var logManager = require('../utils/log-manager.js');

/** Global Vars */
var logger = logManager.getLogger();
var dbConnectionMaxTry = 3;
var dbConnectionRetryCount = 0;

/**
 * Test the DB connection of DynamoDB. IT fetches the list of Tables & prints it as the count.
 */
function testDBConnection () {
    /** Get the list of tables */
    logger.info('[utils] Checking DB connection (DynamoDB)');
    db.getTablesList(function (err, data) {
        if(err) {
            recordErrors(err, generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
            recordErrors(err, 'Cant talk to DB. Trying Again');
            if (dbConnectionRetryCount < dbConnectionMaxTry) {
                dbConnectionRetryCount++;
                logger.info('[utils] DB Connection failed, Trying again in 5 seconds');
                setTimeout(testDBConnection, 5000);
            } else {
                recordErrors(err, generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, 'Giving up'));
            }
        } else {
            logger.info('[utils] Successfully connected to DB. There are total of ' + data.TableNames.length + ' tables');
        }
    });
}

/**
 * Generates HTTPJSONERROR Response.
 * @param {string} errorName - Name of the error.
 * @param {string} errorCode - HTTP error code.
 * @param {string} errorMessage - message of the error.
 */
function generateHTTPResponseJson(errorName, errorCode, errorMessage) {
    logger.info('[utils] Generating error json for ' + errorName  + errorCode  + errorMessage);
    return JSON.stringify({
        name: errorName,
        statusCode: errorCode,
        message: errorMessage
    });
}

/**
 * Generates HTTPJSONERROR Response.
 * @param {obj} err - errorOBj.
 * @param {msg} msg - message of the error
 */
function recordErrors(err, msg) {
    logger.error(err.code);
    logger.error(msg);
    return;
}

/**
 * Generates Error Object.
 * @param {string} errorId - ID/NAme of the error.
 * @param {string} errorCode - HTTP erorr code.
 * @param {string} errorMessage - message of the error.
 */
function generateError(errorId, errorCode, errorMessage) {
    var error = new Error(errorMessage);
    error.code = errorCode;
    error.name = errorId;
    return error;
}

/**
 * Generate ErrorJSON based on the ErrorOBJ from DynamoDB.
 * @param {obj} err - error object from the DynamoDB.
 */
function checkError(err) {
    logger.info('[utils] Checking ErrorJSON based on the ErrorOBJ from DynamoDB.');
    if(err) {
        if(err.code) {
            return JSON.parse(generateHTTPResponseJson(err.name, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, err.message));
        }
        var errJSON;
        try {
            errJSON = JSON.parse(err);
        } catch (e) {
            logger.error('Invalid error JSON');
        }
        if(errJSON.statusCode) {
            return errJSON;
        }
    }
}

exports.testDBConnection = testDBConnection;
exports.recordErrors = recordErrors;
exports.generateHTTPResponseJson = generateHTTPResponseJson;
exports.generateError = generateError;
exports.checkError = checkError;
