/**
 * @overview Ties together all controls for easy importing to application
 */

/**
 * Names of controllers in current directory
 * @type {Array}
 */

let controllers = [
    'page',
    'authorization',
    'account',
    'authentication',
    'configuration',
    'json'
];

/**
 * Include controllers
 */

controllers.forEach(function (name) {
    exports[name] = require('./' + name);
});
