/**
 * @overview UserOrg (Map) entitiy
 */

var Org = {
    tableName: 'orgs',

    meters: function() {
        return this.hasMany('Meter', 'org_id', 'id');
    }
};

module.exports = Org;
