/**
 * @overview Responsible for account services
 */

let querystring = require('querystring');

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    BulbAPIIntegrations = require('./BulbAPIIntegrations');

let BulbIntegration = {
    /**
     * Prepares client to redirect to bulb integration authorization page
     * @param  {int} id Id of bulb integration (falsey if new integration)
     * @param  {string} type which Bulb API integration to use
     * @param  {Object} sess Session object
     * @return {Promise} Resolves with URL to redirect to
     */
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

        return (function() {
            /**
             * Resolve this step if this isn't an update to an existing integration
             */
            if(!id) {
                return Promise.resolve();
            }

            /**
             * Fetch the integration being updated
             */
            return new Entity.Integration({id: id, owner: client.id}).fetch().then(function (results) {
                if(!results) { //doesn't exist
                    return Promise.reject({
                        noRecord: true
                    });
                }

                /**
                 * To keep track that we're updating, append something to the
                 * `state` variable (this is potentially bad practice)
                 *
                 * {state}~{id_to_update}
                 */
                state += "~" + id;
                return Promise.resolve();
            });
        }()).then(function() {
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

    /**
     * Updates the label for an already-existing integration
     * @param  {Object} params Parameters for update
     * @param  {Object} sess   Session object
     * @return {Promise}
     */
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
            /**
             * Reject if can't find integration to update
             */
            if(!integration) {
                errors.general = ['Couldn\'t find integration'];
                return Promise.reject(errors);
            }

            return integration.set({
                label: params.label
            }).save();
        });
    },

    /**
     * Deletes an integration
     * @param  {int} integrationId Id associated with integration to delete
     * @param  {Object} sess Session object
     * @return {Promise}
     */
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
            /**
             * Reject if can't find integration to delete
             */
            if(!integration) {
                errors.general = ['Couldn\'t find integration'];
                return Promise.reject(errors);
            }

            return integration.destroy();
        });
    },

    /**
     * Authorizes a user with a bulb integration
     * @param  {Object} params Object with integration ID, label, etc...
     * @param  {string} type Integration type to use
     * @param  {Object} sess Session object
     * @return {[type]}        [description]
     */
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

        /**
         * Check to make sure that the state received from 3rd party equals the
         * state stored in session
         */
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

    /**
     * Retrieve bulb integration information
     * @param  {int} integrationId integration ID to look for
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success
     */
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
                return Promise.reject({
                    noRecord: true
                });
            }

            return Promise.resolve(integration);
        });
    }
};

module.exports = BulbIntegration;
