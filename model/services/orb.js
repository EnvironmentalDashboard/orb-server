/**
 * @overview Responsible for orb services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./recognition');


let Orb = {

    /**
     * Calculaes relative usage by delegating the calculation to a shell script, which
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
            daySets = params.daySets,
            start = params.start,
            end = params.end;

        return new Promise(function (resolve, reject) {
            exec(
                "php ./exe/relative-usage.php '" + id + "' '" + daySets + "' '" + start + "' '" + end + "'",
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
     */
    emulate: function (orb) {

        let now = +new Date()/1000|0; //get unix milliseconds, divide by 1000, floor
        console.log(orb.get('meter1'));
        return this.relativeUsageCalculator({
            id: orb.get('meter1'),
            daySets: '[1,2,3,4,5,6,7]',
            end: now,
            start: now - 60*60*24*7*2
        }).then(function (percentage) {

            let hue = 140 - ((percentage/100) * 140),
                frequency = ((percentage/100)*2.5) + .5; //times per second

            return new Promise(function(resolve) {
                resolve({
                    hue: hue,
                    frequency: frequency
                });
            })

        }).catch(console.log.bind(console));

    },

    dispatchInstruction: function (instruction, bulb) {

        return LifxBulbAPI.setBreathe({
            from_color: 'hue:' + instruction.hue + ' brightness:.5 saturation:1',
            color: 'hue:' + instruction.hue + ' brightness:.8 saturation:1',
            period: 1/instruction.frequency,
            cycles: 10*instruction.frequency,
        }, 'c44d8b51d65e94af62de72dac6ea3cf8475bfb61665ed7b6d968311e854af34a').then(function (mes){
            console.log(mes);
        }).catch(console.log.bind(console));

    }
};

module.exports = Orb;
