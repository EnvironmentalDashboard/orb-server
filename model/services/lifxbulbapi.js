/**
 * @overview LifX API wrapper
 */

let requestPromise = require('request-promise-native');

let Entity = require('../entities'),
    Recognition = require('./recognition');

let LifxBulbAPI = {

    getBulbList: function (token) {
        return requestPromise({
            url: 'https://api.lifx.com/v1/lights/all',
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    },

    setBreathe: function(params, selector, token) {
        return requestPromise({
            url: 'https://api.lifx.com/v1/lights/' + selector + '/effects/breathe',
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token
            },
            form: params,
            simple: false,
            resolveWithFullResponse: true
        }).then(function(response) {
            console.log(response);
            console.log(response.statusCode);
        });
    }

};

module.exports = LifxBulbAPI;
