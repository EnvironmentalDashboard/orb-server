/**
 * @overview Bulb entitiy
 */

let User = require('./user'),
    Orb = require('./orb');


var Bulb = {
    tableName: 'orb-server_bulbs',

    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    orb: function() {
        return this.belongsTo('Orb', 'orb');
    },

    validate: function() {
        return Promise.resolve();
    }
};

module.exports = Bulb;
