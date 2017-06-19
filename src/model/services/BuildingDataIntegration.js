/**
 * @overview Responsibilities include adding & deleting user/API info, populating db w/ data
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    BuildingOSAPI = require('./BuildingOSAPI.js');

let BuildingDataIntegration = {
    /**
     * Saves a building data integration setup to the database and updates user's
     * current integration setting
     * @param  {Object} params Parameter with user, pass, client id, client secret
     * @param  {Object} sess Session object
     * @return {Promise} Resolves if successful
     */
    save: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({ authError: true });
        }

        if('coreUserID' in client && !!client.coreUserID) {
            return Promise.reject('Building data integration already linked');
        }

        let username = params.username,
            password = params.password,
            clientId = params.clientId,
            clientSecret = params.clientSecret;

        return BuildingOSAPI.exchangeAccessCode(username, password, clientId, clientSecret).then(function(token) {
            /**
             * If the promise resolved then the credentials validate
             *
             * Step 1 : Create a new API entry
             */

            let api = new Entity.API({
                'client_id': clientId,
                'client_secret': clientSecret,
                'username': username,
                'password': password,
                'token': token
            });

            return api.save();
        }).then(function(api) {
            /**
             * Step 2 : Create a new core user (NOT an Orb Server user). The `api_id`
             * must point to the API entry just created
             */
            let extUser = new Entity.CoreUser({
                'api_id': api.get('id'),
                'slug': 'environmental-orb-user-' + client.id + '-api-' + api.get('id'),
                'name': 'Environmental Orb User ' + client.id + ' (' + client.email + ') API ' + api.get('id')
            });

            return extUser.save();
        }).then(function(extUser){
            /**
             * Step 3 : Update the user's core ID to point to the core user just
             * created
             */
            let user = new Entity.User({
                id: client.id,
                coreUserID: extUser.get('id')
            });

            return user.save();
        });
    },

    /**
     * Used to fetch building data integrations associated with user
     * @param  {Object} sess Session object
     * @return {Promise} Resolves if successful
     */
    retrieve: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({ authError: true });
        }

        /**
         * Fetch current user
         */
        return new Entity.User({
            id: client.id
        }).fetch().then(function(user) {
            /**
             * Resolve if the current user doesn't have an associated core user
             */
            if(!user.get('coreUserID') || user.get('coreUserID') == '0') {
                return Promise.resolve(false);
            }

            /**
             * Fetch the associated core user, along with the related API entry,
             * and resolve with it
             */
            return new Entity.CoreUser({
                id: user.get('coreUserID')
            }).fetch({ withRelated: ['API'] });
        });
    }

};

module.exports = BuildingDataIntegration;
