/**
 * @overview Responsible for user authentication
 */

let validator = require('validator');

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    Meter = require('./meter');


let Orb = {

    create: function(params, sess, reqCache, done) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return done();
        }

        /**
         * Validation
         */

        let title = params.title.trim(),
            meter1 = params.meter1,
            meter2 = params.meter2;

        /**
         * Need to track errors
         * @type {Object}
         */
        let errors = {};

        /**
         * Set a resolve function to store the errors in the request cache
         * before calling the done callback, only if there are errors.
         */
        let resolve = function() {
            if(Object.keys(errors).length !== 0) {
                reqCache.set('errors', errors);
                reqCache.set('form', {
                    title: title,
                    meter1: meter1,
                    meter2: meter2
                });

                Meter.initializeMeterList(reqCache, sess, done);
            } else {
                done();
            }
        };

        if (title.length > 150) {
            errors.title = ['Title too long. 150 characters maximum.'];
        }

        if (!validator.isNumeric(meter1)) {
            errors.meter1 = ['Meter not found in our database.'];
        }

        if (!validator.isNumeric(meter2)) {
            errors.meter2 = ['Meter not found in our database.'];
        }

        if(errors.meter1 || errors.meter2) {
            return resolve();
        }

        new Entity.Meter({id: meter1}).fetch().then(function (match) {
            if (!match) {
                errors.meter1 = ['Meter not found in our database.'];
            }

            new Entity.Meter({id: meter2}).fetch().then(function (match2) {
                if (!match2) {
                    errors.meter2 = ['Meter not found in our database.'];
                }

                if(Object.keys(errors).length !== 0) {
                    return resolve();
                }


                /**
                 * Save to database if validation has passed
                 */
                new Entity.Orb({
                    title: title,
                    owner: client.id,
                    meter1: meter1,
                    meter2: meter2
                }).save().then(function() {
                    return resolve();
                })
            });
        });
    }
};

module.exports = Orb;
