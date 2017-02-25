/**
 * @overview LifX API wrapper
 *
 * @todo Ween off of request-promise-native
 */

let requestPromise = require('request-promise-native');

let Entity = require('../entities'),
    Recognition = require('./Recognition');

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
        }).then(function(response) {
            let instructions = {
                bulb: {}
            };

            switch (response.statusCode) {
                case 401 || 403:
                    instructions.user = {
                        badToken: 1
                    };

                    break;

                case 404:
                    instructions.bulb = {
                        enabled: -1
                    };

                    break;

                case 429:
                    instructions.user = {
                        pauseUntil: response.headers['x-ratelimit-reset']
                    };

                    break;

                case 207 || 200:
                    /**
                     * Holds interpreted bulb states
                     * @type Object
                     */
                    let status = {
                        'ok': 'online',
                        'offline': 'offline',
                        'timed_out': 'unknown'
                    };

                    instructions.bulb.status = JSON.parse(response.body).results[0].status;
                    break;
            }

            return Promise.resolve({
                raw: response,
                instructions: instructions
            });
        });
    }

};

module.exports = LifxBulbAPI;
