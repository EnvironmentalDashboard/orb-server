/**
 * @overview Building entitiy
 *
 * This is likely to change
 */

let Bookshelf = require('./base');

let Meter = require('./meter');

let Building = Bookshelf.Model.extend({
    tableName: 'buildings',
    meters: function() {
        return this.hasMany('Meter', 'building_id');
    }
});

module.exports = Building;
