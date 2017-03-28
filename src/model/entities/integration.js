/**
 * @overview Integrations entitiy
 */

let User = require('./user');


var Integration = {
    tableName: 'orb-server_integrations',

    owner: function() {
        return this.belongsTo('User', 'owner');
    }
};

module.exports = Integration;
