/** LIFEX Bulb Integration File **/
let requestPromise = require('request-promise-native');

let urls = {
    interface: 'https://api.lifx.com/v1/lights/',
    authorize: 'https://cloud.lifx.com/oauth/'
};

let LIFXAPI = {
    accessPoints: urls,
    exchangeAccessCode: function(params, sess) {
        /**
         * Parameters which must be included in request to gain access to the
         * user's access token, given their response token
         * @type {Object}
         */
        let options = {
            json: {
                client_id: process.env.LIFX_CLIENT_ID,
                client_secret: process.env.LIFX_CLIENT_SECRET,
                code: params.code,
                grant_type: 'authorization_code'
            },
            headers: {
                'User-Agent': 'node.js'
            }
        };

        /**
         * Request the access token
         */
        return requestPromise.post(urls.authorize + 'token', options, function(err, res, bod) {
            if (sess.request_state != params.state) {
                return Promise.reject({
                    stateError: 'Request does not validate.'
                });
            }

            /**
             * Everything went well; save the access token
             */
            let token = bod.access_token;

            return Promise.resolve(token);
        });
    },

    retrieveBulbList: function(token) {
        let method = function(response) {
            let instructions = {};

            switch (response.statusCode) {
                case 401 || 403:
                    //Bad token
                    instructions.integration = {
                        status: 0
                    };

                    break;

                case 429:
                    //Must pause until...
                    instructions.integration = {
                        pauseUntil: response.headers['x-ratelimit-reset']
                    };
                    break;
            }

            return Promise.resolve({
                results: response.body || '[]',
                instructions: instructions
            });
        };

        return requestPromise({
            url: urls.interface + 'all',
            headers: {
                "Authorization": "Bearer " + token
            },
            resolveWithFullResponse: true //Without this no headers are returned
        }).then(method).catch(method);
    },

    breathe: function(params, selector, token) {
        return requestPromise({
            url: urls.interface + selector + '/effects/breathe',
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
                    //Bad token
                    instructions.integration = {
                        status: 0
                    };

                    break;

                case 404:
                    //Bulb doesn't exist
                    instructions.bulb = {
                        enabled: -1
                    }

                    break;

                case 429:
                    //Must pause until...
                    instructions.integration = {
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
                        'timed_out': 'timed out'
                    };

                    //Bulb status is...
                    let reportedStatus = JSON.parse(response.body).results[0].status;

                    if(reportedStatus in status) {
                        instructions.bulb.status = status[reportedStatus];
                    } else {
                        instructions.bulb.status = "unknown";
                    }

                    break;
            }

            return Promise.resolve({
                raw: response,
                instructions: instructions
            });
        });
    }
};

module.exports = LIFXAPI;
