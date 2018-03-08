/**
 * @overview Ties together all views for easy importing to application
 */

/**
 * Names of views in current directory
 * @type {Array}
 */

let views = [
    'default',
    'authentication',
    'dashboard',
    'orb',
    'guide',
    'bulb',
    'account',
    'authorization',
    'orbInstructions',
    'docs'
];

/**
 * Include views
 */

views.forEach(function(name) {
    module.exports[name] = require('./' + name);
});
