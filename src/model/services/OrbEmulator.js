/**
 * @overview Responsible for orb emulation service
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    LifxBulbAPI = require('./LifxBulbAPI');

let OrbEmulator = {

    /**
     * Emulates an inputted orb
     * @param {Promise} orb Resolves with an object with hue and frequeny.
     * @param {Integer} meter The meter that should be emulated
     */
    emulate: function(orb, meter) {
        if (isNaN(meter) || !(meter === 1 || meter === 2)) {
            return Promise.reject('Unknown meter');
        }

        /**
         * Holds arrays of orb percentile hues
         * @type {Array}
         */
        let hues = [
            [120, 83, 60, 38, 0], //meter1 colors
            [180, 220, 250, 285, 315] //meter2 colors
        ];

        return orb.related('relativeValue' + meter).fetch().then(function(relativeValue) {
            let percentage = relativeValue.get('relative_value');

            let hue = hues[meter - 1][Math.round((percentage / 100) * 4)],
                frequency = ((percentage / 100) * 2.5) + .5; //times per second

            /**
             * Percentage of -1 indicates it hasn't been updated yet.
             */
            if (percentage < 0) {
                hue = -1;
                frequency = 0;
            }

            return Promise.resolve({
                hue: hue,
                frequency: frequency,
                period: frequency != 0 ? 1 / frequency : 0,
                usage: percentage
            });

        }).catch(console.log.bind(console));

    }
};

module.exports = OrbEmulator;
