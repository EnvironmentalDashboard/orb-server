/**
 * @overview Responsible for bulb services
 */

let Bookshelf = require('../components/bookshelf'),
    util = require('util');

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    BulbAPIIntegrations = require('./BulbAPIIntegrations');

let BulbList = {
    /**
     * Retrieves a list of all bulbs for session-authenticated user
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on errors.
     */
    retrieve: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        /**
         * Holds information for any associated bulbs
         * @type {Object}
         */
        let bulbList = {};

        /**
         * Retrieve bulbs associated with user.
         *
         * Happens in 2 steps:
         *  1. Bulbs are retrieved from API and information from the API is stored
         *     inside the bulbList object.
         *  2. Bulbs are queried from the database, and the configuration settings
         *     are set on the already-created values from step #1
         *
         * Note: If bulb exists in database but not API, it will not propagate in
         * the list
         */
        return Entity.Integration.collection().fetch({
            owner: client.id
        }).then(function(results) {
            let bulbListRetrievals = [];

            /**
              * Step 1 (bulbs from API)
              */
            results.forEach(function(integration) {
                let API = BulbAPIIntegrations[integration.attributes.type];

                let retrieval = API.retrieveBulbList(integration.attributes.token).then(function(response) {
                    let bulbsFromAPI = response.results;

                    /**
                     * Follow any instructions given to modify the integration
                     */
                    if (response.instructions.integration) {
                        integration.set(response.instructions.integration);
                        bulbListRetrievals.push(integration.save());
                    }

                    /**
                     * Add each bulb to the list
                     */
                    JSON.parse(bulbsFromAPI).forEach(function(bulb) {
                        bulbList[bulb.id] = {
                            info: bulb
                        };
                    });
                });

                bulbListRetrievals.push(retrieval);
            });

            return Promise.all(bulbListRetrievals);
        }).then(function() {
            /**
              * Step 2 (bulbs from database)
              */
             return Entity.Bulb.collection().query('where', 'owner', '=', client.id).fetch({
                 withRelated: ['orb']
             });
        }).then(function(bulbCollection) {

            if (bulbCollection) {
                bulbCollection.forEach(function(bulb) {
                    //Only propagate if information for the bulb is pre-existing
                    if (bulbList[bulb.get('selector')]) {
                        bulbList[bulb.get('selector')].config = bulb;
                    }
                });
            }

            return Promise.resolve(bulbList);
        });
    }
};

module.exports = BulbList;
