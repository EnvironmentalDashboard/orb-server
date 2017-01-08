/**
 * @overview Ties together all controls for easy importation to application
 */

/**
 * Names of controllers in current directory
 * @type {Array}
 */

let controllers = [
    'page',
    'authorization',
    'account',
    'authentication'
];

/**
 * Include controllers
 */

controllers.forEach(function (name) {
    exports[name] = require('./' + name);
});
