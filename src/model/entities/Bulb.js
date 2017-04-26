/**
 * @overview Bulb entitiy
 */

let User = require('./User'),
    Orb = require('./Orb'),
    Integration = require('./Integration');


var Bulb = {
    tableName: 'orb-server_bulbs',

    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    orb: function() {
        return this.belongsTo('Orb', 'orb');
    },

    integration: function() {
        return this.belongsTo('Integration', 'integration');
    },

    validate: function() {
        return Promise.resolve();
    }
};

module.exports = Bulb;
