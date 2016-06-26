// /**
//  * Created by ikaur on 6/25/16.
//  */
// var accountSid = '';
// var authToken = '[AuthToken]';
//
// //require the Twilio module and create a REST client
// var client = require('twilio')(accountSid, authToken);
// function makeTwilioCall(patientName,contactName,cb){
//     client.calls.create({
//         to: "",
//         from: "+",
//         url: "http://ishneetkaur.com/testmsg11.php?patientName=" + URLEncoder.encode(patientName, "UTF-8") + "&contactName=" + URLEncoder.encode(contactName, "UTF-8"),
//         method: "GET",
//         fallbackMethod: "GET",
//         statusCallbackMethod: "GET",
//         record: "false"
//     }, function(err, call) {
//         console.log(call.sid);
//     });
//     cb(null,"SUCCESS");
// }
//
// exports.makeTwilioCall = makeTwilioCall;