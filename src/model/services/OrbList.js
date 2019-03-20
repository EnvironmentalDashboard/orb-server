/**
 * @overview Responsible for orbs listing
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    OrbEmulator = require('./OrbEmulator');

let OrbList = {
    /**
     * Retrieves a list of all orbs
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on error.
     */
    retrieve: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        /**
         * Keeps track of all orbs
         * @type {Array}
         */
        let orbList = [];

        /**
         * Query for a collection of all orbs related to authenticated client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).orderBy('title').fetch({
            withRelated: ['relativeValue1', 'relativeValue2']
        }).then(function(results) {
            /**
             * Loop through each orb and store it in orbList
             *
             * This process is convoluted: meterPromises is an array which carries
             * promises receiving relevant meter information and adding that information
             * to orbList.
             */
            let meterPromises = [];

            results.forEach(function(orb) {
                let orbInfo = {
                    id: orb.get('id'),
                    title: orb.get('title')
                };

                /**
                 * MeterPromise fetches the meter, building info for relativeValue1
                 * & relativeValue2, stores relevant information on orbInfo, then
                 * pushes orbInfo onto the end of orbList
                 * @type {Promise}
                 */

                let meterPromise = orb.related('relativeValue1').related('meter').fetch({
                    withRelated: ['building']
                }).then(function(meter) {
                    orbInfo.meter1 = {
                        building: meter.related('building').get('name'),
                        name: meter.get('name')
                    };

                    return orb.related('relativeValue2').related('meter').fetch({
                        withRelated: ['building']
                    });
                }).then(function(meter) {
                    if(meter) {
                        orbInfo.meter2 = {
                            building: meter.related('building').get('name'),
                            name: meter.get('name')
                        };
                    }

                    orbList.push(orbInfo);
                });

                meterPromises.push(meterPromise);
            });

            return Promise.all(meterPromises);
        }).then(function() {
            return Promise.resolve(orbList);
        });
    },

    /**
     * Retrieves a list of orb instructions using the emulator
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on error.
     */
    retrieveInstructionsList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        /**
         * Query for a collection of all orbs associated with the recognized
         * client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function(orbs) {
            /**
             * Stores promises of relative usage calculation
             * @type {Array}
             */
            let relativeUsagePromises = [];

            /**
             * Associates an orb and meter with entries w/ same key in
             * `relativeUsagePromises`
             * @type {Array}
             */
            let keyToOrb = [];

            let instructions = {};

            /**
             * this is also convoluted. One variable stores the promises while
             * the other stores the orb information pertinent to that promise.
             */
            orbs.forEach(function(orb) {
                relativeUsagePromises.push(OrbEmulator.emulate(orb, 1, orb.get('colorScheme1')));
                relativeUsagePromises.push(OrbEmulator.emulate(orb, 2, orb.get('colorScheme2')));

                keyToOrb.push({
                    orb: orb,
                    meter: 1
                });
                keyToOrb.push({
                    orb: orb,
                    meter: 2
                });
            });

            /**
             * On resolve, combine the two separate tracking arrays into one
             */
            return Promise.all(relativeUsagePromises).then(function(instructionsReturned) {
                instructionsReturned.forEach(function(instruction, key) {
                    let orbId = keyToOrb[key].orb.get('id'),
                        meter = keyToOrb[key].meter;

                    if (!instructions[orbId]) {
                        instructions[orbId] = {
                            meters: []
                        };
                    }

                    let colors = instruction.pulseBetween;

                    if(instruction.pulseBetween === -1) {
                        /**
                         * The color of this orb could not be resolved
                         */

                        instruction.hue1 = 255;
                        instruction.saturation1 = 255;
                        instruction.lightness1 = 255;

                        instruction.hue2 = 255;
                        instruction.saturation2 = 255;
                        instruction.lightness2 = 255;
                    } else {
                        let initialColor = colors[0],
                            finalColor = colors[1];
                        
                        // var l = (2 - hsv.s / 100) * hsv.v / 2;
                        // from https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
                        let lightness1 = (2 - initialColor[2]) * initialColor[1] / 2,
                            lightness2 = (2 - finalColor[2]) * finalColor[1] / 2;

                        // var s = hsv.s * hsv.v / (l < 50 ? l * 2 : 200 - l * 2)
                        let saturation1 = initialColor[1] * initialColor[2] / (lightness1 < 0.5 ? lightness1 * 2 : 2 - lightness1 * 2),
                            saturation2 = finalColor[1] * finalColor[2] / (lightness2 < 0.5 ? lightness2 * 2 : 2 - lightness2 * 2);

                        instruction.hue1 = initialColor[0];
                        instruction.saturation1 = saturation1*100;
                        instruction.lightness1 = lightness1*100;

                        instruction.hue2 = finalColor[0];
                        instruction.saturation2 = saturation2*100;
                        instruction.lightness2 = lightness2*100;
                    }

                    instructions[orbId].meters[meter] = instruction;
                });

                return Promise.resolve(instructions);
            });

        }).then(function(list) {
            return Promise.resolve(list);
        });
    }
};

module.exports = OrbList;
