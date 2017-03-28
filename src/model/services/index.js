/**
 * @overview Handles all services for easy importing
 */

/**
 * Names of service groups in current directory
 * @name entities
 * @type {Array}
 */
let groups = [
    'Account',
    'MeterList',
    'Orb',
    'OrbList',
    'OrbEmulator',
    'OrbInstructionsDispatcher',
    'Bulb',
    'BulbList',
    'Recognition',
    'BulbIntegration',
    'RelativeValue'
];

/**
 * Include controllers
 */

groups.forEach(function(name) {
    module.exports[name] = require('./' + name);
});
