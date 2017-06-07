/**
 * @overview Lists the bulb integrations
 */

let querystring = require('querystring');

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let BulbIntegrationList = {
    /**
     * Retrieves list of bulb integrations
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success
     */
    retrieve: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        return Entity.Integration.collection().query('where', 'owner', '=', client.id).fetch().then(function (results) {
            return results.models;
        });
    }
};

module.exports = BulbIntegrationList;
