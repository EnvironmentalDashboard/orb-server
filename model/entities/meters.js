/**
 * @overview Meter entitiy
 *
 * This is likely to change
 */

let Bookshelf = require('./base');

let Meter = require('./meter');

let Meters = Bookshelf.Collection.extend({
    model: Meter
});

module.exports = Meters;
