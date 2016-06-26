/**
 * Created by ikaur on 6/25/16.
 */
// var PokitDok = require('./index.js');
var PokitDok = require('pokitdok-nodejs');
var config = require('config');

function fetchAllProviders(cb) {
    var pokitdok = new PokitDok(config.POKITDOK_CONFIG.POKITDOK_CLIENT_ID, config.POKITDOK_CONFIG.POKITDOK_CLIENT_SECRET);

    pokitdok.providers({
        zipcode: 94089,
        radius: '10mi'
    }, function (err, res) {
        if (err) {
            return console.log(err, res.statusCode);
        }
        // res.data is a list of results
        for (var i = 0, ilen = res.data.length; i < ilen; i++) {
            var provider = res.data[i].provider;
            console.log(provider.first_name + ' ' + provider.last_name + ' ' + provider.phone);
        }
        cb(null, res.data);
    });
}

exports.fetchAllProviders               = fetchAllProviders;