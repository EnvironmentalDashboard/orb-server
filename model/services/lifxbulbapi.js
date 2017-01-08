/**
 * @overview Responsible for user authentication
 */

let requestPromise = require('request-promise-native');

let Entity = require('../entities'),
    Recognition = require('./recognition');

let LifxBulbAPI = {

    getBulbList: function(token) {
        return requestPromise({
            url: 'https://api.lifx.com/v1/lights/all',
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }
};

module.exports = LifxBulbAPI;
