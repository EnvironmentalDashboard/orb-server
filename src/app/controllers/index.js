/**
 * @overview Ties together all controls for easy importing to application
 */

/**
 * Names of controllers in current directory
 * @type {Array}
 */

let controllers = [
    'default',
    'buildingdata',
    'authentication',
    'dashboard',
    'orb',
    'bulb',
    'account',
    'authorization',
    'docs'
];

/**
 * Include controllers
 */

controllers.forEach(function(name) {
    exports[name] = require('./' + name);
});
