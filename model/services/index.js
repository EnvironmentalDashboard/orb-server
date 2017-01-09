/**
 * @overview Handles all services for easy import
 */

/**
 * Names of service groups in current directory
 * @name entities
 * @type {Array}
 */
let groups = [
    'User',
    'Recognition',
    'Dashboard',
    'Meter',
    'Orb',
    'Bulb',
    'Authorization'
];

/**
 * Include controllers
 */

groups.forEach(function (name) {
    module.exports[name] = require('./' + name.toLowerCase());
});
