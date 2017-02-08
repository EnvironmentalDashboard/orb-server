/**
 * @overview Responsible for orb services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./recognition'),
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
    relativeUsageCalculator: function (params) {
        let id = params.id, //meter ID
            daySets = params.daySets.slice(1, -1),
            sampleSize = params.sampleSize;

        //return Promise.resolve(Math.floor(Math.random()*101));


        return new Promise(function (resolve, reject) {
            exec(
                "php ./exe/relative-usage.php '" + id + "' '" + daySets + "' '" + sampleSize + "'",
                function (err, stdout, stderr) {
                    if (err) {
                        reject(err);
                    }

                    resolve(stdout);
                }
            );
        });


    },

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

        return this.relativeUsageCalculator({
            id: meters[meter-1],
            daySets: orb.get('daySets'),
            sampleSize: orb.get('sampleSize')
        }).then(function (percentage) {

            let hue = hues[meter-1][Math.round((percentage/100) * 4)],
                frequency = ((percentage/100)*2.5) + .5; //times per second

            return Promise.resolve({
                hue: hue,
                frequency: frequency,
                period: 1/frequency,
                usage: percentage
            });

        }).catch(console.log.bind(console));

    },

    dispatchInstruction: function (instruction, bulb) {

    return new Entity.User({id: bulb.get('owner')}).fetch().then(function (owner) {
            return LifxBulbAPI.setBreathe({
                from_color: 'hue:' + instruction.hue + ' brightness:.6 saturation:1',
                color: 'hue:' + instruction.hue + ' brightness:.3 saturation:1',
                period: 1/instruction.frequency,
                cycles: 10*instruction.frequency
            }, 'id:' + bulb.get('selector'), owner.get('token')).then(function (mes){
                Promise.resolve();
            }).catch(console.log.bind(console));
        });

    },

    dispatchAll: function () {
        let me = this;

        Entity.Bulb.collection().query('where', 'enabled', '=', '1').fetch({withRelated: ['orb']})
        .then(function (bulbs) {
            bulbs.forEach(function (bulb){
                /**
                 * Calculate which meter to display. Every 20 seconds, this changes.
                 * Take the timestamp in ms and divide by 1000ms/1s, then divide by
                 * 20s. Floor this value (|0), mod 2 and add 1.
                 */
                let meter = ((+new Date()/20000|0) % 2)+1;

                me.emulate(bulb.relations.orb, meter).then(function (instruction) {
                    me.dispatchInstruction(instruction, bulb);
                });
            });
        })
    }
};

module.exports = Orb;
