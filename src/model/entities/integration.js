/**
 * @overview Integrations entitiy
 */

let User = require('./user')


var Integration = {
    tableName: 'orb-server_bulbs',

    owner: function() {
        return this.belongsTo('User', 'owner');
    }
};

module.exports = Integration;
