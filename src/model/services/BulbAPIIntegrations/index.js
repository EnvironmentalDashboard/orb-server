/**
 * @overview Handles all integrations for easy importing
 */

/**
 * Names of integrations in current directory
 * @name entities
 * @type {Array}
 */
let integrations = [
    'LIFX'
];

/**
 * Include controllers
 */

integrations.forEach(function(name) {
    module.exports[name] = require('./' + name);
});
