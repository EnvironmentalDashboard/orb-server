/**
 * @overview Core user entitiy
 *
 * This refers to users in the `users` table and NOT the `orb-server_users` table
 */

let Building = {
    tableName: 'users',
    idAttribute: 'id',

    API: function() {
        return this.belongsTo('API', 'api_id');
    }
};

module.exports = Building;
