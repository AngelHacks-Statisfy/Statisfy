/**
 * Created by ikaur on 6/25/16.
 */
var https = require('https');

var nutritionix = require('nutritionix')({
    appId: '',
    appKey: ''
}, false);

function getNutritionValue(item, cb) {
    var apiUrl = "https://api.nutritionix.com/v1_1/search/<<itemName>>?&fields=_score,item_name,brand_name,item_id,nf_calories,nf_serving_size_qty,nf_total_fat,nf_serving_size_unit&appId=&appKey=";
    apiUrl = apiUrl.replace("<<itemName>>", item);
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
            console.log(product);
            cb(null,product);
        });
    });
}

exports.getNutritionValue = getNutritionValue;




