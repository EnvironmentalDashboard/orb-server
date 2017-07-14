/**
 * @overview Responsible for orb services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    OrbEmulator = require('./OrbEmulator'),
    RelativeValue = require('./RelativeValue');

let Orb = {
    /**
     * Retrieves information about single orb
     * @param  {Integer} orbId ID of orb to recieve
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on errors.
     */
    retrieve: function(orbId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        /**
         * Fetches the specified orb limited to the session-authenticated user
         */
        return new Entity.Orb({
            id: orbId,
            owner: client.id
        }).fetch({ withRelated: ['relativeValue1', 'relativeValue2'] }).then(function(orb) {
            if (!orb) {
                return Promise.reject({
                    noRecord: true
                });
            }

            return Promise.resolve(orb);
        });
    },

    /**
     * Takes orb parameters and attempts save.
     * @param  {Object} params Configuration parameters
     * @param {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on errors.
     *
     * @TODO this has gotten pretty messy... might want to do all processing
     * prior to sending information to the model.
     */
    save: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let title = params.title.trim(),
            meter1 = params.meter1,
            meter2 = params.meter2,
            inputtedDaySets = params.daySets,
            sampleSizes = params.sampleSizes;

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
        let daySets = [];

        inputtedDaySets.forEach(function(val, index) {
            let key = parseInt(val, 10) || 0;

            if (!daySets[key]) {
                daySets[key] = [];
            }

            daySets[key].push(index + 1);

            /**
             * Sample sizes must be between 5 and 20
             */
            if (sampleSizes[index] < 5) {
                sampleSizes[index] = 5;
            } else if (sampleSizes[index] > 50) {
                sampleSizes[index] = 50;
            }
        });

        let orb = new Entity.Orb({
            title: title,
            owner: client.id
        });

        /**
         * If this is an update, we will need to ensure we update relative value
         * columns rather than creating new ones.
         *
         * These keep track of that.
         */
        let relativeValue1ForeignKey = null,
            relativeValue2ForeignKey = null;

        /**
         * Validation chain
         *
         * @TODO meter validation will need to change when BuildingOS is integrated
         */
        return orb.validate().then(function(validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            return Promise.resolve();
        }).then(function() {
            /**
             * If this is an update, not an insert
             */
            if (params.id) {
                /**
                 * Set the orb's ID to the requested ID
                 */
                orb.set({
                    id: params.id
                });

                /**
                 * Need to make sure the client owns this orb, so query for an
                 * orb with the requested ID owned by the client
                 */
                return new Entity.Orb({
                    id: params.id,
                    owner: client.id
                }).fetch();
            }

            return Promise.resolve();
        }).then(function(matchedOrb) {
            if (params.id && !matchedOrb) {
                errors.noRecord = true;
            } else if (params.id) {
                relativeValue1ForeignKey = matchedOrb.get('relativeValue1Id');
                relativeValue2ForeignKey = matchedOrb.get('relativeValue2Id');
            }

            if(meter2 && meter2 !== "") {
                return new Entity.Meter({
                    'bos_uuid': meter2
                }).fetch().then(function(match) {
                    if (!match) {
                        errors.meter2 = ['Meter not found in database.'];
                    }
                });
            } else {
                return Promise.resolve();
            }
        }).then(function(){
            return new Entity.Meter({
                'bos_uuid': meter1
            }).fetch();
        }).then(function(match) {
            if (!match) {
                errors.meter1 = ['Meter not found in database.'];
            }

            /**
             * This is the last error check; resolve here if there are errors to
             * prevent saving
             */
            if (Object.keys(errors).length !== 0) {
                return Promise.reject(errors);
            }

            return Promise.resolve();
        }).then(function() {

            /**
             * Generate `grouping` array
             */
            let groupingObj = daySets.map(function(set, key) {
                let obj = {
                    days: set,
                    npoints: sampleSizes[key]
                };

                return obj;
            });

            let filteredGroupingObj = groupingObj.filter(function(val) {
                return val.days.length > 0;
            });

            /**
             * Create, save RelativeValue instances
             */
            let relativeValues = [
                new Entity.RelativeValue({
                    'id': relativeValue1ForeignKey,
                    'meter_uuid': meter1,
                    'relative_value': -1,
                    'grouping': JSON.stringify(filteredGroupingObj),
                    'permission': 'orb_server'
                }),
                new Entity.RelativeValue({
                    'id': relativeValue2ForeignKey,
                    'meter_uuid': meter2,
                    'relative_value': -1,
                    'grouping': JSON.stringify(filteredGroupingObj),
                    'permission': 'orb_server'
                }),
            ];

            let relativeValuePromises = relativeValues.map(function(relVal) {
                return relVal.save();
            });

            return Promise.all(relativeValuePromises);

        }).then(function(relativeValues) {
            /**
             * Once saving is complete, the relativeValues have primary keys
             */
            orb.set({
                relativeValue1Id: relativeValues[0].get('id'),
                relativeValue2Id: relativeValues[1].get('id')
            });

            RelativeValue.update([
                relativeValues[0],
                relativeValues[1]
            ]);

            return orb.save();
        });
    },

    delete: function(orbId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        return new Entity.Orb({
            id: orbId,
            owner: client.id
        }).fetch({
            withRelated: ['relativeValue1', 'relativeValue2']
        }).then(function(match) {
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
             * Delete associated relative values
             */
            let relativeValue1Promise = match.related('relativeValue1').destroy(),
                relativeValue2Promise = match.related('relativeValue2').destroy();

            /**
             * Delete this orb
             */
            let deleteOrbPromise = match.destroy();

            return Promise.all(
                [affectBulbsPromise, deleteOrbPromise, relativeValue1Promise, relativeValue2Promise]
            );
        });
    },
};

module.exports = Orb;
