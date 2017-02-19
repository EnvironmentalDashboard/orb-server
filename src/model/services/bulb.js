/**
 * @overview Responsible for bulb services
 */

let Bookshelf = require('../components/bookshelf'),
    util = require('util');

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi');

let Bulb = {
    /**
     * Retrieves a list of all bulbs for session-authenticated user
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on errors.
     */
    retrieveList: function(sess) {
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
                return Promise.reject('This account isn\'t authroized with a LIFX account. Please authorize to link your accounts.');
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

    },

    /**
     * Takes parameters and attempts to configure a bulb
     * @param  {Object} params Configuration parameters
     * @return {Promise} Resolves on success, rejects on errors.
     */
    save: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let errors = {};

        let selector = params.selector,
            enabled = params.enabled;

        /**
         * Filter the orb input so that empty is null
         * @type {Integer}
         */
        let orb = params.orb === "" ? null : params.orb;

        let bulbParams = {
            owner: client.id,
            selector: selector,
            enabled: enabled === "true", //convert string to Boolean
            orb: orb
        };

        let bulb = new Entity.Bulb(bulbParams);

        return bulb.validate().then(function(validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs); //Merge errors
            }

            /**
             * If the orb is null, there's no reason to ensure the orb exist
             */
            if (orb == null) {
                return Promise.resolve();
            }

            /**
             * Fetch the inputted orb to validate existence and ownership
             * @type {[type]}
             */
            return new Entity.Orb({
                id: orb
            }).fetch();
        }).then(function(match) {
            if ((match && match.get('owner') === client.id) ||
                orb == null) {

                /**
                 * NOTICE: data mapper logic leaking to service layer because Knex
                 * and Bookshelf do not support upserts
                 */
                let query = util.format(`\
                    INSERT INTO \`%s\` (owner, enabled, orb, selector)
                        VALUES (:owner, :enabled, :orb, :selector)
                    ON DUPLICATE KEY UPDATE
                        enabled = :enabled,
                        orb = :orb,
                        owner = :owner
                `, bulb.tableName);

                return Bookshelf.knex.raw(query, bulbParams);

            }

            return Promise.resolve();
        })

    }
};

module.exports = Bulb;
