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
    'DashboardInformation',
    'LifxBulbAPI',
    'Orb',
    'OrbEmulator',
    'OrbInstructionsDispatcher',
    'Bulb',
    'Recognition'
];

/**
 * Include controllers
 */

groups.forEach(function(name) {
    module.exports[name] = require('./' + name.toLowerCase());
});
