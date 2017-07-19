/**
 * @overview Responsible for organization listing
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let OrganizationList = {
    /**
     * Retrieves a list of all orgs
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on error.
     */
    retrieve: function() {
        return Entity.Organization.collection().fetch().then(function(organizations) {
            return Promise.resolve(organizations.models);
        });
    },

    /**
     * Retrieves a list of all orgs
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on error.
     */
    retrieveForUser: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let userOrgPromise = Entity.UserOrg.collection().query('where', 'user_id', '=', client.id).fetch();

        return userOrgPromise.then(function(userOrgs) {
            return Promise.resolve(userOrgs.models);
        });
    }
};

module.exports = OrganizationList;
