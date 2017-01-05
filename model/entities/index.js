/**
 * @overview Handles all entities
 */


/**
 * Dependencies
 */
let _ = require('lodash');

/**
 * Names of entities in current directory
 * @name entities
 * @type {Array}
 */
let entities = [
    'User',
    'Orb'
];

/**
 * Include controllers
 */

entities.forEach(function (name) {
//    _.assignIn(exports, require('./' + name));
    module.exports[name] = require('./' + name.toLowerCase());
});
