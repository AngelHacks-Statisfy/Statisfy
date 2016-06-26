var AWS = require('aws-sdk');
var config = require('config');
var awsAccessKeyId = config.AWS_CONFIG.accessKeyId;
var awsSecretKey = config.AWS_CONFIG.secretAccessKey;
var awsRegion = 'us-east-1';
var kinesisStream = 'StriivStream';
AWS.config.update({
	accessKeyId: awsAccessKeyId,
	secretAccessKey: awsSecretKey,
	region: awsRegion
});
var kinesis = new AWS.Kinesis();
var DynamoDB = require('aws-dynamodb')(config.AWS_CONFIG);
var OAuth = require('oauth');

var request_token_url = 'https://striiv-api-prod.appspot.com/api/1/request_token';
var access_token_url = 'https://striiv-api-prod.appspot.com/api/1/access_token';
var activities_url = 'https://striiv-api-prod.appspot.com/api/1/user/activities/start/2016-06-25/end/2016-06-25/json';

var CONSUMER_KEY = '';
var CONSUMER_SECRET = '';

var API_SECRET = '';
var API_KEY = '';
var USER_ID = '';

exports.pushStriiv = function(cb) {
		var oauth = new OAuth.OAuth(
			request_token_url,
			access_token_url,
			CONSUMER_KEY,
			CONSUMER_SECRET,
			'1.0',
			null,
			'PLAINTEXT'
		);
		oauth.get(
			activities_url,
			API_KEY,
			API_SECRET,
			function(error, data, res) {
				if(error) {
					console.error(error);
				} else {
					var parsed_data = JSON.parse(data);
					var sendData = {"activitySeconds" : parsed_data.summary[0].activitySeconds.toString(),
									"calories" : parsed_data.summary[0].calories.toString(),
									"distance" : parsed_data.summary[0].distance.toString(),
									"totalSteps" : parsed_data.summary[0].totalSteps.toString()};
					console.log(sendData);
					var params = {
						Data: JSON.stringify(sendData),
						PartitionKey: USER_ID.toString(),
						StreamName: kinesisStream
					};
					kinesis.putRecord(params, function(err, data,res) {
						if(err) { console.log(err) }
						else { console.log(data) }
						cb(null,data,res);
					});
				}
			}
		)
};

exports.getStriiv = function(cb) {

	var queryBuilder = DynamoDB
		.table("StriivData") /** Table names are stored in yaml files */
		.where('Id').eq("");
	queryBuilder
		.query(function (err, data) {
			return cb(err, data);
		});
};
