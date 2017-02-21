/**
 * @overview Responsible for bulb services
 */

let Bookshelf = require('../components/bookshelf'),
    util = require('util');

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    LifxBulbAPI = require('./LifxBulbAPI');

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
        return Recognition.refreshClient(sess).then(function(user) {
            client = user;

            /**
             * If the client's token is empty/null then they haven't tried to
             * authorize their account with LifX
             */
            if (user.get('token') == null || user.get('token') === '') {
                return Promise.reject('This account isn\'t authorized with a LIFX account. Please authorize to link your accounts.');
            }

            /**
             * Step 1 (bulbs from API)
             */
            return LifxBulbAPI.getBulbList(client.get('token')).catch(function() {
                return Promise.reject('The access token associated with your account went bad. Please reauthorize to link your accounts.');
            });

        }).then(function(bulbsFromAPI) {
            /**
             * Add each bulb to the list
             */
            JSON.parse(bulbsFromAPI).forEach(function(bulb) {
                bulbList[bulb.id] = {
                    info: bulb
                };
            });

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
