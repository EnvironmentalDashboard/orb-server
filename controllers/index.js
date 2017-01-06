/**
 * @overview Handles all controllers
 */

/**
 * Names of controllers in current directory
 * @type {Array}
 */

let controllers = [
    'pages',
    'authentication'
];

/**
 * Include controllers
 */

controllers.forEach(function (name) {
    exports[name] = require('./' + name);
});
