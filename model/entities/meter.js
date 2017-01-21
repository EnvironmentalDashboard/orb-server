/**
 * @overview Meter entitiy
 *
 * This is likely to change
 */

let Bookshelf = require('./base');

let Building = require('./building');

let Meter = Bookshelf.Model.extend({
    tableName: 'meters',
    building: function() {
        return this.belongsTo('Building', 'building_id');
    }
});

module.exports = Meter;
