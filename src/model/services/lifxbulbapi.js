/**
 * @overview LifX API wrapper
 *
 * @todo Ween off of request-promise-native
 */

let requestPromise = require('request-promise-native');

let Entity = require('../entities'),
    Recognition = require('./recognition');

let LifxBulbAPI = {
    /**
     * Fetches all lights from API
     * @param  {String} token Access token
     * @return {Promise} Resolves on succeess, rejects on errors.
     */
    getBulbList: function(token) {
        return requestPromise({
            url: 'https://api.lifx.com/v1/lights/all',
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    },

    /**
     * Instructions LIFX API
     * @param  {Object} params Params to send LIFX in body
     * @param  {String} selector A LIFX selector
     * @param  {String} token Access token
     * @return {Promise} Resolves on succeess, rejects on errors.
     */
    setBreathe: function(params, selector, token) {
        return requestPromise({
            url: 'https://api.lifx.com/v1/lights/' + selector + '/effects/breathe',
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token
            },
            form: params,
            simple: false,
            resolveWithFullResponse: true //Without this no headers are returned
        });
    }

};

module.exports = LifxBulbAPI;
