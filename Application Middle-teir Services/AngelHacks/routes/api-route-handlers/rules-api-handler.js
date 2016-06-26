'use strict';
/*
 This file is responsible for handing api requests related to rules.
 Currently supported APIs are
 */



//Local Vars
var constants = require('./../../secret/constants.js');
var utils = require('./../../utils/utils.js');
var dataProcessor = require('./../../server/dataProcessor.js');
var db = require('./../../server/db');

var logManager;
var logger = console;
exports.set = function (data) {
    logManager = data.logManager;
    logger = data.logger;
    return exports;
};

exports.updateRules = function (req, res) {
    //Mandatory Params
    var ruleId          = req.params.rule_id;
    var rules           = (req.params.rule_set);

    // Optional Params
    var destination     = req.query.destination;
    var metric_name     = req.query.metric_name;
    var origin          = req.query.origin;
    var platform        = req.query.platform;
    var title           = req.query.title;


    //Default Params
    var enabled         = req.query.enabled;

    if(!ruleId){
        res.status(constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
        return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ID_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ID_ERROR_MESSAGE));
    }

    if(!rules){
        res.status(constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
        return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ERROR_MESSAGE));
    }

    logger.info('Updating rules to the DB with id: ' + ruleId);

    dataProcessor.updateRules(ruleId, rules, function (err, data) {
        if(err) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_CONFLICT_CODE);
            if(err.code === constants.DYNAMO_ERROR_CODES.ConditionalCheckFailedException) {
                return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, constants.HTTP_ERROR_MESSAGES.DYNAMODB_DUPLICATE_ERROR_MESSAGE));
            }
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
        } else {
            res.send(utils.generateHTTPResponseJson(constants.HTTP_STATUS_IDS.RULE_UPDATED_SUCCESS_ID, constants.HTTP_STATUS_CODES.HTTP_SUCCESS_CODE, constants.HTTP_STATUS_MESSAGES.RULES_UPDATED_SUCCESS_MESSAGE + ruleId));
        }
    });

};


exports.fetchRuleById = function (req, res) {
    //Mandatory Params
    var ruleId = req.query.ruleId;

    if(!ruleId) {
        res.status(constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
        return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ERROR_MESSAGE));
    }

    logger.info('Fetching rule from the DB with id: ' + ruleId);

    db.fetchRuleById(ruleId, function (err, data) {
        if(err) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));

        } else if(!data || Object.keys(data).length === 0) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT,
                constants.HTTP_ERROR_MESSAGES.NO_DATA_FOR_RULE_MESSAGE));
        } else {
            res.send(JSON.stringify(data));
        }
    });


};

exports.getNutrition = function (req, res) {
    //Mandatory Params
    var foodItem = req.query.foodItem;

    if(!foodItem) {
        res.status(constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
        return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ERROR_MESSAGE));
    }

    logger.info('Fetching Product with name: ' + foodItem);

    db.getNutritionByName(foodItem, function (err, data) {
        if(err) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));

        } else if(!data || Object.keys(data).length === 0) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT,
                constants.HTTP_ERROR_MESSAGES.NO_DATA_FOR_RULE_MESSAGE));
        } else {
            res.send(JSON.stringify(data));
        }
    });


};

exports.fetchRules = function (req, res) {
    logger.info('Fetching all Rules from the DB');
    db.fetchAllRules('FetchRules', function (err, data) {
        if(err) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
        }
        if(!data || Object.keys(data).length === 0) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT, constants.HTTP_ERROR_MESSAGES.NO_DATA_QUERY_ERROR_MESSAGE));
        } else {
            res.send(data);
        }
    });
};

exports.fetchProviders = function (req, res) {
    logger.info('Fetching all Providers from the PokitDok');
    db.fetchAllProviders('FetchProviders', function (err, data) {
        if(err) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
        }
        if(!data || Object.keys(data).length === 0) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT, constants.HTTP_ERROR_MESSAGES.NO_DATA_QUERY_ERROR_MESSAGE));
        } else {
            res.send(data);
        }
    });
};

exports.pushToKinesis = function (req, res) {
    logger.info('Pushing data from Striiv to kinesis');
    db.pushStriivKinesis('SendData', function (err, data) {
        if(err) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
        }
        if(!data || Object.keys(data).length === 0) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT, constants.HTTP_ERROR_MESSAGES.NO_DATA_QUERY_ERROR_MESSAGE));
        } else {
            res.send(data);
        }
    });
};

exports.getFromKinesis = function (req, res) {
    logger.info('Retrieving data from kinesis');
    db.getStriivKinesis('GetData', function (err, data) {
        if(err) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
        }
        if(!data || Object.keys(data).length === 0) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT, constants.HTTP_ERROR_MESSAGES.NO_DATA_QUERY_ERROR_MESSAGE));
        } else {
            res.send(data);
        }
    });
};

var productArray = [];

exports.saveNutrition = function (req, res) {
    //Mandatory Params
    var foodItem = req.body.foodItem;

    if(!foodItem) {
        res.status(constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
        return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ERROR_MESSAGE));
    }

    logger.info('Fetching Product with name: ' + foodItem);

    db.getNutritionByName(foodItem, function (err, data) {
        if(err) {
            res.status(constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));

        } else if(!data || Object.keys(data).length === 0) {
            return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT,
                constants.HTTP_ERROR_MESSAGES.NO_DATA_FOR_RULE_MESSAGE));
        } else {
            productArray.push(data);
        }
    });
};


exports.getAllProducts = function (req, res) {
    if(productArray.length == 0) {
        res.status(constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
        return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ERROR_MESSAGE));
    } else {
        res.send(JSON.stringify(productArray));
    }
};

function verifyRulesHttpInput(destination, platform, title, origin, metric_name, rules) {
    if(!destination) {
        return utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_DESTINATION_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_DESTINATION_ERROR_MESSAGE);
    }
    if(!platform) {
        return utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_PLATFORM_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_FREQUENCY_ERROR_MESSAGE);
    }
    if(!title) {
        return utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_GAME_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_GAME_ERROR_MESSAGE);
    }
    if(!origin) {
        return utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_ORIGIN_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_ORIGIN_ERROR_MESSAGE);
    }
    if(!metric_name) {
        return utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_METRIC_NAME_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_METRIC_NAME_ERROR_MESSAGE);
    }
    if(!rules) {
        return utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.MISSING_RULE_ERROR, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, constants.HTTP_ERROR_MESSAGES.MISSING_RULES_ERROR_MESSAGE);
    }
}

function checkTitleMetricAvailability(title, metric){

    db.getMetricByTitleName(title, function (err, data) {
        if(err) {
            return (constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND);
            // return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.DYNAMODB_ERROR_ID, err.code, err.message));
        }

        if(!data || Object.keys(data).length === 0) {
            return (constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT);
            //   return res.send(utils.generateHTTPResponseJson(constants.HTTP_ERROR_IDS.NO_DATA_STRING_ERROR_ID, constants.HTTP_STATUS_CODES.HTTP_NO_CONTENT, constants.HTTP_ERROR_MESSAGES.NO_DATA_QUERY_ERROR_MESSAGE));
        }
        //res.send(data);
    });


}