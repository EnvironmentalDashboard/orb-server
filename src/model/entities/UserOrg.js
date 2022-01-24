/**
 * @overview UserOrg (Map) entitity
 */

let User = require('./User'),
    Organization = require('./Organization');


var UserOrg = {
    tableName: 'orb-server_user-org-map',

    user: function() {
        return this.belongsTo('User', 'user_id');
    },

    org: function() {
        return this.belongsTo('Organization', 'org_id');
    },
};

module.exports = UserOrg;
