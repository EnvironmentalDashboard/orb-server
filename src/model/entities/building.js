/**
 * @overview Building entitiy
 *
 * This is likely to change
 */

let Meter = require('./meter');

let Building = {
    tableName: 'buildings',
    meters: function() {
        return this.hasMany('Meter', 'building_id');
    }
};

module.exports = Building;
