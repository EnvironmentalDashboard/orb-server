/**
 * @overview Handles all services for easy import
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
    'Recognition'
];

/**
 * Include controllers
 */

groups.forEach(function (name) {
    module.exports[name] = require('./' + name.toLowerCase());
});
