/**
 * @overview Responsible for organization listing
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    OrbEmulator = require('./OrbEmulator');

let OrganizationList = {
    /**
     * Retrieves a list of all orgs
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on error.
     */
    retrieve: function() {
        return Entity.Organization.collection().fetch().then(function(organizations) {
            return Promise.resolve(organization.models);
        });
    }
};

module.exports = OrganizationList;
