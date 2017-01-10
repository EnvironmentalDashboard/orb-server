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

    /**
    .setBreathe({
         period: 2,
         cycles: 5,
         color: 'green',
         from_color: 'red'
     }, 'c9e66ba4c539cd973acb294d9f1b3b48eb7b4b9ce3d5b8d836a3d51ebd541341')
     */
    setBreathe: function(params, token) {
        return requestPromise({
            url: 'https://api.lifx.com/v1/lights/all/effects/breathe',
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token
            },
            form: params
        });
    }

};

module.exports = LifxBulbAPI;
