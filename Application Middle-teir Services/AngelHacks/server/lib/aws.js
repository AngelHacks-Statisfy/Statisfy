'use strict';

/** @module server/db/lib/aws
 * 1) Send Messages to SQS
 */


/** Modules import */
var AWS = require('aws-sdk');
var config = require('config');

/** Local Imports */
var utils = require('./../../utils/utils.js');
var logManager = require('../../utils/log-manager.js');

/** Global Vars */
AWS.config.update(config.AWS_CONFIG);
AWS.config.region = config.AWS_CONFIG.region;
var logger = logManager.getLogger();

