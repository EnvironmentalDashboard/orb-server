/**
Add * @overview Integrations entitity
 */

let User = require('./User');


var Integration = {
    tableName: 'orb-server_integrations',

    owner: function() {
        return this.belongsTo('User', 'owner');
    }
};

module.exports = Integration;
