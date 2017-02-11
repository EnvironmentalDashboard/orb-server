/**
 * @overview Ties together all controls for easy importing to application
 */

let modelview = require('./modelview');

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
    exports[name] = modelview(require('./' + name));
});
