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
    'BulbIntegration',
    'BulbIntegrationList',
    'Bulb',
    'BulbList',
    'Meter',
    'MeterList',
    'OrganizationList',
    'Orb',
    'OrbList',
    'OrbEmulator',
    'OrbInstructionsDispatcher',
    'Recognition',
    'RelativeValue'
];

/**
 * Include controllers
 */

groups.forEach(function(name) {
    module.exports[name] = require('./' + name);
});
