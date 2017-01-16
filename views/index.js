/**
 * @overview Ties together all views for easy importing to application
 */

let _ = require('lodash');

/**
 * Names of views in current directory
 * @type {Array}
 */

let views = [
    'page',
    'account',
    'authentication',
    'dashboard',
    'authorization',
    'json'
];

/**
 * Include views
 */

views.forEach(function (name) {
    module.exports[name] = require('./' + name);
});
