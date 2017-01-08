/**
 * @overview Meter entitiy
 *
 * This is likely to change
 */

let Bookshelf = require('./base');


var Meter = Bookshelf.Model.extend({
    tableName: 'meters'
});

module.exports = Meter;
