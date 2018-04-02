/**
 * @overview Responsible for orb emulation service
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let OrbEmulator = {

    /**
     * Emulates an inputted orb
     * @param {Promise} orb Resolves with an object with hue and frequeny.
     * @param {Integer} meter The meter that should be emulated
     */
    emulate: function(orb, meter, colorScheme) {
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
            // [120, 180, 188, 212, 250]
        ];

        return orb.related('relativeValue' + meter).fetch().then(function(relativeValue) {
            if (!(orb.get('colorScheme' + meter) in hues)) {
                return Promise.resolve({
                    hue: -1,
                    frequency: 0,
                    period: 0,
                    usage: -1
                });
            }

            let percentage = relativeValue.get('relative_value');

            let key = Math.round((percentage / 100) * 4),
                hue = -1;

            if(key in hues[orb.get('colorScheme' + meter)]) {
                hue = hues[orb.get('colorScheme' + meter)][key];
            }

            let frequency = ((percentage / 100) * 1.7) + .25; //times per second

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
