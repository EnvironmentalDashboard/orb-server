/**
 * @overview Responsible for organization services
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let Organization = {
    /**
     * Maps organizations to user
     * @param  {Object} User User object
     * @param  {Array} Organizations Organizations to add
     * @return {Promise}
     */
    addToUser: function(user, organizations) {
        let saveOrgPromises = [];

        organizations.forEach(function(orgId) {
            let userOrg = new Entity.UserOrg({
                user_id: user.get('id'),
                org_id: orgId
            });

            saveOrgPromises.push(userOrg.save().catch(function(err){
                return Promise.resolve(); //errors here likely due to key constraints
            }));
        });

        return Promise.all(saveOrgPromises);
    },

    /**
     * Delets mapped organizations from user
     * @param  {Object} User User object
     * @param  {Array} Organizations Organizations to remove
     * @return {Promise}
     */
    removeFromUser: function(user, organizations) {
        let deleteOrgPromises = [];

        organizations.forEach(function(orgId) {
            let userOrg = new Entity.UserOrg({
                user_id: user.get('id'),
                org_id: orgId
            });

            let deletePromise = userOrg.fetch().then(function(row){
                if(row) {
                    return row.destroy();
                }

                return Promise.resolve();
            }).catch(console.log.bind(this));

            deleteOrgPromises.push(deletePromise);
        });

        return Promise.all(deleteOrgPromises);
    },

    updateUser: function(organizations, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let user = new Entity.User({ id: client.id });

        let userOrgListPromise = Entity.UserOrg.collection().query('where', 'user_id', '=', user.get('id')).fetch();

        let orgArray = [],
            addOrgs, deleteOrgs,
            me = this;

        return userOrgListPromise.then(function(orgList) {
            orgList.forEach(function(org) {
                orgArray.push(org.get('org_id'))
            });

            let findDifference = function(a, b) {
                return a.filter(function(val) {
                    if(b.indexOf(val) < 0) {
                        return val;
                    }
                });
            };

            deleteOrgs = findDifference(orgArray, organizations);
            addOrgs = findDifference(organizations, orgArray);

            let addPromise = me.addToUser(user, addOrgs);
            let removePromise = me.removeFromUser(user, deleteOrgs)

            return Promise.all([addPromise, removePromise]);
        });
    }
};

module.exports = Organization;
