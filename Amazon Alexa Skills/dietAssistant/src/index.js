var https = require('https');

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

         if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.a************1") {
         context.fail("Invalid Application ID");
         }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            getNutritionValueIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user ask to get nutrition value.
 */
function getNutritionValueIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("WhatIsNutritionValueIntent" === intentName) {
        askNutritionValue(intent, session, callback);
    } else if ("ItemValueIntent" === intentName) {
        getNutritionValue(intent, session, callback);
    } else if ("CalorieValueIntent" === intentName) {
        getCalorieValue(intent, session, callback);
    } else if ("FatValueIntent" === intentName) {
        getFatValue(intent, session, callback);
    } else if ("LastItemIntent" === intentName) {
        askLastProductConfirm(intent, session, callback);
    } else if ("ConfirmLastProductIntent" === intentName) {
        getLastProductFromSession(intent, session, callback);
    } else if ("PokitDokProviderIntent" === intentName) {
        getProvider(intent, session, callback);
    } else if ("GoodByeIntent" === intentName || "AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session, callback) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);

    handleSessionEndRequest(callback);
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Hey Vishwa. How are you today? Oh! So many people at the demo. Wow.";
    var repromptText = "Could you say that again";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Eat Healthy. Stay Healthy. Have fun.";
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


/**
 * Gets the nutrition value of product for the user.
 */
function askNutritionValue(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    speechOutput = "Yes. Tell me the name of the item you want to eat and I'll decide";
    repromptText = "I'm sorry. Could you say that again. You can say pizza or Starbucks Double shot espresso";

        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}



/**
 * Gets the last product value of product for the user.
 */
function askLastProductConfirm(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    speechOutput = "Oh really";
    repromptText = "Are you hanging up on me again.";

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Gets the nutrition value of product for the user.
 */
function getNutritionValue(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    console.log("-----------------> " + intent.slots.ItemName.value);
    var item = intent.slots.ItemName.value;


    var apiUrl = "https://api.nutritionix.com/v1_1/search/<<itemName>>?&fields=_score,item_name,brand_name,item_id,nf_calories,nf_serving_size_qty,nf_total_fat,nf_serving_size_unit&appId=5*****0&appKey=730*****************5fb";
    apiUrl = apiUrl.replace("<<itemName>>", item);

    console.log("-----------------> " + apiUrl);

    https.get(apiUrl, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            var product = stringResult.hits[0];
            var score = product._score;
            var item_name = product.fields.item_name;
            var nf_serving_size_qty = product.fields.nf_serving_size_qty;
            var nf_serving_size_unit = product.fields.nf_serving_size_unit;
            sessionAttributes = buildProductInSession(product);
            speechOutput = nf_serving_size_qty + " " + nf_serving_size_unit + " of " + item_name + " has nutrition value of " + score;
            repromptText = "Would you like to know anything else? You can say can you tell me the fat content or what is the calorie value";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }).on('error', function (e) {
        speechOutput = "I'm sorry. Could you say that again.";
        repromptText = "I'm sorry. Could you say that again.";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}



/**
 * Gets the diet plan provider for the user.
 */
function getProvider(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    var apiUrl = "http://ec2-54-85-202-76.compute-1.amazonaws.com:8080/api/v1/providers";

    console.log("-----------------> " + apiUrl);

    https.get(apiUrl, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            var firstName = stringResult[0].provider.first_name;
            var lastName = stringResult[0].provider.last_name;
            var phoneNumber = stringResult[0].provider.locations[0].phone;
            speechOutput = "The dietician you are looking for is " + firstName + " " + lastName + ". You can contact them at " + phoneNumber;
            repromptText = "Would you like to know anything else?";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }).on('error', function (e) {
        speechOutput = "I'm sorry. Could you say that again.";
        repromptText = "I'm sorry. Could you say that again. For example, You can say what is the nutrition value of this item.";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

    speechOutput = "The best dietician in the area is Vincent Le. You can contact him on 4083182840";
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function buildProductInSession(product) {
    return {
        product: product
    };
}


/**
 * Gets the calorie value of product for the user.
 */
function getCalorieValue(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var product;
console.log("getCalorieValue");
    console.log("---BEFORE-----> "+ JSON.stringify(session.attributes.product));
    if (session.attributes) {
        product = session.attributes.product;
    }
    console.log("----AFTER----> "+ JSON.stringify(session.attributes.product));

    if (product) {
        speechOutput = product.fields.item_name + " has total " +  product.fields.nf_calories + " calories ";
        shouldEndSession = false;
    } else {
        speechOutput = "I'm sorry. I could not find the last item. I can search for a new item if you want.";
        shouldEndSession = true;
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


/**
 * Gets the fat value of product for the user.
 */
function getFatValue(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var product;
    console.log("getFatValue");

    console.log("---BEFORE-----> "+ JSON.stringify(session.attributes.product));
    if (session.attributes) {
        product = session.attributes.product;
    }
    console.log("----AFTER----> "+ JSON.stringify(session.attributes.product));

    if (product) {
        speechOutput = product.fields.item_name + " has " +  product.fields.nf_total_fat + " fat content ";
        shouldEndSession = false;
    } else {
        speechOutput = "I'm sorry. I could not find the last item. I can search for a new item for you if you want.";
        shouldEndSession = true;
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


function getLastProductFromSession(intent, session, callback) {
    var product;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        product = session.attributes.product;
    }

    if (product) {
        speechOutput = "The last item was" + product.item_name;
        shouldEndSession = true;
    } else {
        speechOutput = "I'm sorry. I could not find the last item. I can search for a new item for you if you want.";
    }

    callback(sessionAttributes,
        buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}