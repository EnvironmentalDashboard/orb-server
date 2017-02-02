/**
 * @overview Responsible for account services
 */

let Bookshelf = require('../../lib/dbconnect.js'),
    util = require('util');

let Entity = require('../entities'),
    Recognition = require('./recognition');

let Configuration = {

    createOrb: function(params, cache, sess) {
        let client = Recognition.knowsClient({required: true}, cache, sess);

        if (!client) {
            cache.set('auth-error', true);
            return Promise.resolve();
        }

        let title = params.title.trim(),
            meter1 = params.meter1,
            meter2 = params.meter2,
            inputtedDaySets = params.daySets,
            sampleSize = params.sampleSize;

        /**
         * Need to track errors
         * @type {Object}
         */
        let errors = {};

        /**
         * Convert inputted array (where each key represents a day and each value
         * represents a group) to a parseable, day-grouped string
         * @type {[type]}
         */
        let unfilteredDaySets = [];

        inputtedDaySets.forEach(function (val, index) {
            let key = parseInt(val, 10) || 0;

            if (!unfilteredDaySets[key]) {
                unfilteredDaySets[key] = [];
            }

            unfilteredDaySets[key].push(index + 1);
        });

        /**
         * Sample size must be between 5 and 20
         */
        if (sampleSize < 5) {
            sampleSize = 5;
        } else if (sampleSize > 50) {
            sampleSize = 50;
        }

        let daySets = JSON.stringify(unfilteredDaySets.filter(function (val) {
            return val;
        }));

        let resolve = function () {
            cache.set('errors', errors);
            cache.set('form', {
                title: title,
                meter1: meter1,
                meter2: meter2,
                daySets: inputtedDaySets,
                sampleSize: sampleSize
            });

            return DashboardInformation.initializeMeterList(cache, sess);
        };

        let orb = new Entity.Orb({
            title: title,
            meter1: meter1,
            meter2: meter2,
            owner: client.id,
            daySets: daySets,
            sampleSize: sampleSize
        });

        /**
         * Validation chain
         *
         * @TODO meter validation will need to change when BuildingOS is integrated
         */
        return orb.validate().then(function (validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            return new Entity.Meter({id: meter1}).fetch();
        }).then(function() {
            /**
             * If this is an update
             */
            if(params.id) {
                /**
                 * Set the orb's ID to the requested ID
                 */
                orb.set({id: params.id});

                /**
                 * Need to make sure the client owns this orb, so query for an
                 * orb with the requested ID owned by the client
                 */
                return new Entity.Orb({id: params.id, owner: client.id}).fetch();
            }

            return Promise.resolve();
        }).then(function (matchedOrb) {
            if(params.id && !matchedOrb) {
                errors.denied = ['Cannot find orb with ID ' + params.id + ' associated with this account.'];
            }

            return new Entity.Meter({'bos_uuid': meter1}).fetch()
        }).then(function (match) {
            if (!match) {
                errors.meter1 = ['Meter not found in our database.'];
            }

            return new Entity.Meter({'bos_uuid': meter2}).fetch();
        }).then(function (match) {
            if (!match) {
                errors.meter2 = ['Meter not found in our database.'];
            }

            /**
             * This is the last error check; resolve here if there are errors to
             * prevent saving
             */
            if (Object.keys(errors).length !== 0) {
                return resolve();
            }

            return orb.save();
        }).catch(console.log.bind(console));
    },

    deleteOrb: function(orbId, cache, sess) {
        let client = Recognition.knowsClient({required: true}, cache, sess);

        if (!client) {
            cache.set('auth-error', true);
            return Promise.resolve();
        }

        return new Entity.Orb({
            id: orbId,
            owner: client.id
        }).fetch({withRelated:['meter1', 'meter2']}).then(function(match){
            /**
             * Change bulbs assigned to this orb
             *
             * Note: leaking storage logic into service layer
             */
            let affectBulbsPromise = Entity.Bulb.collection().query().where('orb', '=', orbId).update({
                orb: null,
                enabled: false
            });

            /**
             * Decrease using count on meters

            let meters = [match.related('meter1'), match.related('meter2')];

            let meter1Promise = meters[0].set({
                'orb_server': meters[0].get('orb_server') - 1
            }).save();

            let meter2Promise = meters[1].set({
                'orb_server': meters[1].get('orb_server') - 1
            }).save();
            */

            /**
             * Delete this orb
             */
            let deleteOrbPromise = match.destroy();

            return Promise.all(
                [affectBulbsPromise, deleteOrbPromise]
            );
        });
    },

    saveBulb: function(params, cache, sess) {
        let client = Recognition.knowsClient({required: true}, cache, sess);

        if (!client) {
            cache.set('auth-error', true);
            return Promise.resolve();
        }

        let errors = {};

        let selector = params.selector,
            enabled = params.enabled,
            orb = params.orb === "" ? null : params.orb;

        let bulbParams = {
                owner: client.id,
                selector: selector,
                enabled: enabled === "true",
                orb: orb
            },
            bulb = new Entity.Bulb(bulbParams);

        return bulb.validate().then(function (validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            if(orb == null || orb == "") {
                return Promise.resolve();
            }

            return new Entity.Orb({id: orb}).fetch();
        }).then(function (match) {
            if((match && match.get('owner') === client.id)
                || orb == null) {

                /**
                 * NOTICE: here we leak data mapper logic into the service layer
                 * because Knex.js and Bookshelf.js do not support upserts
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

    },

};

module.exports = Configuration;
