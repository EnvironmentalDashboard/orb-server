/**
 * @overview Ties together all controls for easy importing to application
 */

/**
 * Names of modelviews in current directory
 * @type {Array}
 */

let modelviews = [
    'default',
    'authentication',
    'dashboard',
    'orb',
    'guide',
    'bulb',
    'account',
    'authorization',
    'orbInstructions'
];

/**
 * Include modelviews
 */

modelviews.forEach(function (name) {
    exports[name] = require('./' + name);
});
