/**
 * @overview Handles all entities
 */


/**
 * Dependencies
 */
let _ = require('lodash');

let Bookshelf = require('./base');

/**
 * Names of entities in current directory
 * @name entities
 * @type {Array}
 */
let entities = [
    'User',
    'Orb',
    'Meter',
    'Building',
    'Bulb'
];

/**
 * Include controllers
 */

entities.forEach(function (name) {
    module.exports[name] = require('./' + name.toLowerCase());
    Bookshelf.model(name, module.exports[name]);
});
