'use strict';
/*
 Constants file.
 */


module.exports.HTTP_ERROR_IDS = {
    SET_CACHE_ERROR_ID: 'SetCacheError',
    GET_CACHE_ERROR_ID: 'GetCacheError',
    DELETE_CACHE_ERROR_ID: 'DeleteCacheError',
    INVALID_FREQUENCY: 'InvalidFrequency',
    INVALID_JSON: 'InvalidJson',
    EMPTY_JSON: 'InvalidJson',
    INVALID_URL_INPUT: 'InvalidUrlInput',
    INVALID_RULES_INPUT: 'InvalidRulesInput',
    DYNAMODB_ERROR_ID: 'DynamoDBError',
    MISSING_RULE_ID_ERROR: 'MissingRuleId'
};

module.exports.HTTP_ERROR_MESSAGES = {
    SET_CACHE_ERROR_MESSAGE: 'Cannot set cache because either key or value is empty',
    GET_CACHE_ERROR_MESSAGE: 'Cannot get value because key is empty',
    DELETE_CACHE_ERROR_MESSAGE: 'Cannot delete value because key is empty',
    NO_DATA_QUERY_ERROR_MESSAGE: 'No Data is available for given query',
    NO_DATA_FOR_RULE_MESSAGE: 'No data available for this rule',
    DYNAMODB_NOTFOUND_ERROR_MESSAGE: 'Key doesnt exist in DB.',
    DYNAMODB_DUPLICATE_ERROR_MESSAGE: 'Key already exist in DB.',
    EMPTY_JSON_MESSAGE: 'Score json cant be empty',
    INCORRECT_INPUT_ERROR_MESSAGE: 'Incorrect/Missing inputs entered while entering game metrics.',
    MISSING_RULES_ERROR_MESSAGE: 'Missing rules, kindly provide rules.',
    MISSING_RULES_ID_ERROR_MESSAGE: 'Missing rule id, kindly provide correct rule id.'
};

module.exports.HTTP_STATUS_CODES = {
    /*
     200 (OK) - if an existing resource has been updated
     201 (created) - if a new resource is created
     202 (accepted) - accepted for processing but not been completed (Async processing)

     301 (Moved Permanently) - the resource URI has been updated
     303 (See Other) - e.g. load balancing

     400 (bad request) - indicates a bad request
     404 (not found) - the resource does not exits
     406 (not acceptable) - the server does not support the required representation
     409 (conflict) - general conflict
     412 (Precondition Failed) e.g. conflict by performing conditional update
     415 (unsupported media type) - received representation is not supported

     500 (internal server error) - generic error response
     503 (Service Unavailable) - The server is currently unable to handle the request
     */
    HTTP_SUCCESS_CODE: '200',
    HTTP_NOT_FOUND: '404',
    HTTP_NO_CONTENT: '204',
    HTTP_CONFLICT_CODE: '409',
    HTTP_BAD_REQUEST: '400'
};

module.exports.DAYS = {
    REDIS_DAYS_RETENTION: '-8d',
    DEFAULT_FROM_DAYS: '-1d'
};

module.exports.HTTP_STATUS_IDS = {
    RULE_UPDATED_SUCCESS_ID: 'RuleUpdateSuccess',
};

module.exports.HTTP_STATUS_MESSAGES = {
    RULES_UPDATED_SUCCESS_MESSAGE: 'Rules Updated Successfully with rule_id :',
};

module.exports.DYNAMO_ERROR_CODES = {
    ConditionalCheckFailedException: 'ConditionalCheckFailedException'
};


module.exports.DYNAMODB = 'DYNAMODB';
module.exports.REDIS = 'REDIS';
module.exports.VALUE = 'value';
module.exports.NAME = 'name';
module.exports.DATAPOINTS = 'datapoints';
module.exports.REDIS_ENABLED = false;
module.exports.STOP = 'STOP';
module.exports.START = 'START';
module.exports.REDSHIFT_ENABLED = true;


