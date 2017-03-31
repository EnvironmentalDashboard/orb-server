/**
 * @overview Responsible for account services
 */

let querystring = require('querystring');

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    BulbAPIIntegrations = require('./BulbAPIIntegrations');

let BulbIntegration = {
    prepareRedirect: function(id, type, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let BulbAPI = BulbAPIIntegrations[type];

        /**
         * Random, unguessable string to prevent CSS attacks: base64 encodes the
         * timestamp multipled by a psuedorandom decimal (0-1) and removes non-
         * alphanumerics
         * @type {String}
         */
        let state = (Buffer.from('' + (Math.random() * +new Date())).toString('base64'))
            .replace(/[^0-9a-z]/gi, '');

        return new Promise(function (resolve, reject) {
            if(!id) {
                return resolve();
            }

            return new Entity.Integration({id: id, owner: client.id}).fetch().then(function (result) {
                if(!result) {
                    return reject("Can't find integration.");
                }

                state += "~" + id;
                return resolve();

            });
        }).then(function() {
            sess.request_state = state;

            let query = querystring.stringify({
                client_id: process.env.LIFX_CLIENT_ID,
                scope: 'remote_control:all',
                state: state,
                response_type: 'code'
            });

            return Promise.resolve(BulbAPI.accessPoints.authorize + 'authorize?'
                + query);
        });
    },

    updateLabel: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let errors = {};

        return new Entity.Integration({
            id: params.id
        }).fetch().then(function(integration) {
            if(!integration) {
                errors.general = ['Couldn\'t find integration'];
                return Promise.reject(errors);
            }

            return integration.set({
                label: params.label
            }).save();
        });
    },

    delete: function(integrationId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let errors = {};

        return  new Entity.Integration({
            id: integrationId,
            owner: client.id,
        }).fetch().then(function (integration) {
            if(!integration) {
                errors.general = ['Couldn\'t find integration'];
                return Promise.reject(errors);
            }

            return integration.destroy();
        });
    },

    authorize: function(params, type, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let BulbAPI = BulbAPIIntegrations[type],
            id = params.integrationId || null,
            label = params.label || "Authorization on " + (new Date()).toString();

        if (sess.request_state != params.state) {
            return Promise.reject('Request was hijacked.');
        }

        return BulbAPI.exchangeAccessCode(params, sess).then(function(response) {
            return new Entity.Integration({
                id: id,
                type: type,
                label: label,
                owner: client.id,
                token: response.access_token,
                status: 1
            }).save();
        }).catch(console.log.bind(console));
    },

    retrieve: function(integrationId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        /**
         * Fetches the specified orb limited to the session-authenticated user
         */
        return new Entity.Integration({
            id: integrationId,
            owner: client.id
        }).fetch().then(function(integration) {
            if (!integration) {
                return Promise.reject('Records don\'t exist for the targetted integration');
            }

            return Promise.resolve(integration);
        });
    }
};

module.exports = BulbIntegration;
