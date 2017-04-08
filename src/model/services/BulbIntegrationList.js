/**
 * @overview Responsible for account services
 */

let querystring = require('querystring');

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let BulbIntegrationList = {

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
