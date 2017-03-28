/**
 * @overview Bulb entitiy
 */

let User = require('./user'),
    Orb = require('./orb'),
    Integration = require('./integration');


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
