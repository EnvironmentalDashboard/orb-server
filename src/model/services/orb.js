/**
 * @overview Responsible for orb services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    OrbEmulator = require('./orbemulator'),
    LifxBulbAPI = require('./lifxbulbapi');

let Orb = {

    /**
     * Calculates relative usage by delegating the calculation to a shell script, which
     * outsources it.
     *
     * WARNING! This service passes raw parameter input to the shell. ONLY pass safe
     * filtered values to this function.
     *
     * @param  {Object}   params   Object with id, daysets, start, end parameters
     * @return {Promise}           Returns a promise with error or stdout
     */
    retrieveRelativeUsage: function (params) {
        let id = params.id, //meter ID
            daySets = params.daySets.slice(1, -1),
            sampleSize = params.sampleSize;

        //return Promise.resolve(Math.floor(Math.random()*101));

        return new Promise(function (resolve, reject) {
            exec(
                "php ../model/services/exe/relative-usage.php '" + id + "' '" + daySets + "' '" + sampleSize + "'",
                function (err, stdout, stderr) {
                    if (err) {
                        reject(err);
                    }

                    resolve(stdout);
                }
            );
        });


    },

    retrieveList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let orbList = [];

        /**
         * Query for a collection of all orbs related to authenticated client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).orderBy('title').fetch({
            withRelated: ['meter1', 'meter2']
        }).then(function (results) {
            /**
             * Loop through each orb and store it in orbList
             */
            let meterPromises = [];

            results.forEach(function (orb) {
                let orbInfo = {id: orb.get('id'), title: orb.get('title')};

                meterPromises.push(orb.related('meter1').related('building').fetch().then(function (match) {
                    orbInfo.meter1 = {
                        building: match.get('name'),
                        name: orb.related('meter1').get('name')
                    };

                    return orb.related('meter2').related('building').fetch();
                }).then(function (match) {
                    orbInfo.meter2 = {
                        building: match.get('name'),
                        name: orb.related('meter2').get('name')
                    };

                    return true;
                }));

                orbList.push(orbInfo);
            });

            return Promise.all(meterPromises);
        }).then(function() {
            return Promise.resolve(orbList);
        });
    },

    retrieve: function(orbId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        return new Entity.Orb({
            id: orbId,
            owner: client.id
        }).fetch().then(function (orb) {
            if(!orb) {
                return Promise.reject('Records don\'t exist for the targetted orb');
            }

            return Promise.resolve(orb.attributes);
        });
    },

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
             * If this is an update, not an insert
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
                return Promise.reject(errors);
            }

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
        }).fetch({withRelated:['meter1', 'meter2']}).then(function(match) {
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
             * Delete this orb
             */
            let deleteOrbPromise = match.destroy();

            return Promise.all(
                [affectBulbsPromise, deleteOrbPromise]
            );
        });
    },
};

module.exports = Orb;
