/**
 * @overview Ties together all views for easy importation to application
 */

/**
 * Names of views in current directory
 * @type {Array}
 */

let views = [
    'page',
    'account'
];

/**
 * Include views
 */

views.forEach(function (name) {
    exports[name] = require('./' + name);
});
