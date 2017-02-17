/**
 * @overview RelativeValue entitiy
 *
 * This is likely to change
 */

let RelativeValue = {
    tableName: 'relative_value',
    idAttribute: 'id',
    meter: function() {
        return this.belongsTo('Meter', 'meter', 'id');
    }
};

module.exports = RelativeValue;
