'use strict';
/** @module routes/api */

/** Modules import */
var express = require('express');
var router = module.exports = express.Router();

/** Local Imports */
var logManager = require('../utils/log-manager.js');
var appHandlers = require('./api-route-handlers');

/** Global Vars */
var logger = logManager.getLogger();


/** =================== MIDDLEWARES =========================================== */
/** general middleware that is specific to this router */
router.use(function (req, res, next) {
    logger.info('api endpoint called: ' + req.originalUrl);
    next();
});

/** middleware to check and validate a specific param */
router.param('name', function (req, res, next, name) {
    logger.info('doing name validations on ' + name);

    /** once validation is done save the new item in the req */
    req.username = name;
    /** go to the next thing */
    next();
});

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/** define the api root route */
router.get('/', appHandlers.apiroot);


router.put('/rules/:rule_id/:rule_set', appHandlers.rulesApi.updateRules);

router.get('/fetchRule/', appHandlers.rulesApi.fetchRuleById);

router.get('/rules', appHandlers.rulesApi.fetchRules);

router.get('/providers', appHandlers.rulesApi.fetchProviders);

router.get('/getNutrition/', appHandlers.rulesApi.getNutrition);

router.post('/striivKinesis', appHandlers.rulesApi.pushToKinesis);

router.get('/getStriivKinesis', appHandlers.rulesApi.getFromKinesis);

router.post('/saveNutrition', appHandlers.rulesApi.saveNutrition);

router.get('/getDietHistory/', appHandlers.rulesApi.getAllProducts);

