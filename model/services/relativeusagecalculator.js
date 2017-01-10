/**
 * Relative usage is calculated by delegating to a shell script
 */

let exec = require('child_process').exec;

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
let RelativeUsageCalculator = function (params) {
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

};

module.exports = RelativeUsageCalculator;
