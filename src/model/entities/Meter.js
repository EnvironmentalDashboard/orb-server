/**
 * @overview Meter entitiy
 *
 * This is likely to change
 */

let Building = require('./Building');

let Meter = {
    tableName: 'meters',
    idAttribute: 'bos_uuid',
    building: function() {
        return this.belongsTo('Building', 'building_id');
    }
};

module.exports = Meter;
