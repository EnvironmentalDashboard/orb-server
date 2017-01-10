let RelativeUsageCalculator = require('./relativeusagecalculator');

/**
 * Emulates an inputted orb
 * @param {Promise} orb Resolves with an object with hue and frequeny.
 */
let OrbEmulator = function (orb) {

    let now = +new Date()/1000|0; //get unix milliseconds, divide by 1000, floor
    console.log(orb.get('meter1'));
    return RelativeUsageCalculator({
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

};

module.exports = OrbEmulator;
