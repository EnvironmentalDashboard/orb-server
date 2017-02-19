/**
 * @overview Ties together all controls for easy importing to application
 */

/**
 * Names of controllers in current directory
 * @type {Array}
 */

let controllers = [
    'default',
    'authentication',
    'dashboard',
    'orb',
    'bulb',
    'account',
    'authorization'
];

/**
 * Include controllers
 */

controllers.forEach(function(name) {
    exports[name] = require('./' + name);
});
