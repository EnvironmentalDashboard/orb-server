/**
 * Relative usage is calculated by delegating to a shell script
 */

let relativeUsageCalculator = function (params, callback) {
    let id = params.id,
        daySets = params.sets,
        start = params.start,
        end = params.end;

    exec(
        "php ../../exe/relative.php id + " " + daySets " + start + " " + end,
        callback
    );
};

module.exports = relativeUsageCalculator;
