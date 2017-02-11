/**
 * @overview Responsible for orb services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi'),
    Orb = require('./orb');

let OrbEmulator = {

    /**
     * Emulates an inputted orb
     * @param {Promise} orb Resolves with an object with hue and frequeny.
     * @param {Integer} meter The meter that should be emulated
     */
    emulate: function (orb, meter) {

        if (isNaN(meter)) {
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

        /**
         * Decide on meter id
         */
        let meters = [orb.get('meter1'), orb.get('meter2')];

        console.log('will retrieve');

        console.log({
            id: meters[meter-1],
            daySets: orb.get('daySets'),
            sampleSize: orb.get('sampleSize')
        });

        return Orb.retrieveRelativeUsage({
            id: meters[meter-1],
            daySets: orb.get('daySets'),
            sampleSize: orb.get('sampleSize')
        }).then(function (percentage) {
            console.log(percentage);

            let hue = hues[meter-1][Math.round((percentage/100) * 4)],
                frequency = ((percentage/100)*2.5) + .5; //times per second

            return Promise.resolve({
                hue: hue,
                frequency: frequency,
                period: 1/frequency,
                usage: percentage
            });

        }).catch(console.log.bind(console));

    }
};

module.exports = OrbEmulator;
