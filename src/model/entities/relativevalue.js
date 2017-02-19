/**
 * @overview RelativeValue entitiy
 *
 * This is likely to change
 */

let RelativeValue = {
    tableName: 'relative_values',
    idAttribute: 'id',
    meter: function() {
        return this.belongsTo('Meter', 'meter_uuid');
    }
};

module.exports = RelativeValue;
