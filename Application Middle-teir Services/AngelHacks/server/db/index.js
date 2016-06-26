'use strict';

/** @module server/db/index.js */

/** Local Imports */
var memoryCache = require('../../utils/cache-manager');
var db = require('./db');
var dataProcessor = require('./../dataProcessor');
var utils = require('./../../utils/utils.js');
var logManager = require('../../utils/log-manager.js');
var pokitdok = require('./../../services/pokitdok.js');
var nutrition = require('./../../services/nutrition.js');
var striivkinesis = require('./../../services/striivkinesis.js');

/** Global Vars */
var logger = logManager.getLogger();
exports.processor = dataProcessor;

/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** ------------------------------------------------------------------------------------------------------------------------------------------------ */
/** -------------------------------------------         RULES                                     -------------------------------------------------- */

/**
 * Fetching all rules
 * @param id
 * @param cb
 */
exports.fetchAllRules = function (id, cb) {
    memoryCache.wrap('FETCHRULES' + id, function (cacheCallback) {
        dataProcessor.fetchAllRules(cacheCallback);
    }, {ttl: 1 * 24 * 60 * 60 /** one day */}, cb);
};

/**
 * Fetching rules by Id.
 * @param id
 * @param cb
 */
exports.fetchRuleById = function (id, cb) {
    memoryCache.wrap('FETCHRULESBYID' + id, function (cacheCallback) {
        dataProcessor.fetchRuleById(id, cacheCallback);
    }, {ttl: 1 * 24 * 60 * 60 /** one day */}, cb);
};

exports.fetchAllProviders = function (id, cb) {
    memoryCache.wrap('FETCHPROVIDERS' + id, function (cacheCallback) {
        pokitdok.fetchAllProviders(cacheCallback);
    }, {ttl: 1 * 24 * 60 * 60 /** one day */}, cb);
};

exports.getNutritionByName = function (id, cb) {
    memoryCache.wrap('FETCHNUTRITION' + id, function (cacheCallback) {
        nutrition.getNutritionValue(id, cacheCallback);
    }, {ttl: 1 * 24 * 60 * 60 /** one day */}, cb);
};

exports.pushStriivKinesis = function (id, cb) {
    memoryCache.wrap('PUSHTOKINESIS' + id, function (cacheCallback) {
        striivkinesis.pushStriiv(cacheCallback);
    }, {ttl: 1 * 24 * 60 * 60 /** one day */}, cb);
};

exports.getStriivKinesis = function (id, cb) {
    memoryCache.wrap('GETFROMKINESIS' + id, function (cacheCallback) {
        striivkinesis.getStriiv(cacheCallback);
    }, {ttl: 1 * 24 * 60 * 60 /** one day */}, cb);
};


