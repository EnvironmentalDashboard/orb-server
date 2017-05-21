/**
 * @overview Responsibilities include adding & deleting user/API info, populating db w/ data

 */

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    BuildingOSAPI = require('./BuildingOSAPI.js');

let BuildingDataIntegration = {
    save: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({ authError: true });
        }

        let username = params.username,
            password = params.password,
            clientId = params.clientId,
            clientSecret = params.clientSecret;

        return BuildingOSAPI.exchangeAccessCode(username, password, clientId, clientSecret).then(function(token) {
            /**
             * If the promise resolved then the credentials validate
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
            let extUser = new Entity.CoreUser({
                'api_id': api.get('id'),
                'slug': 'environmental-orb-user-' + client.id + '-api-' + api.get('id'),
                'name': 'Environmental Orb User ' + client.id + ' (' + client.email + ') API ' + api.get('id')
            });

            return extUser.save();
        }).then(function(extUser){
            let user = new Entity.User({
                id: client.id,
                coreUserID: extUser.get('id')
            });

            return user.save();
        }).catch(console.log.bind(console));
    },

    retrieve: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({ authError: true });
        }

        return new Entity.User({
            id: client.id
        }).fetch().then(function(user) {
            if(!user.get('coreUserID') || user.get('coreUserID') == '0') {
                return Promise.resolve(false);
            }

            return new Entity.CoreUser({
                id: user.get('coreUserID')
            }).fetch({ withRelated: ['API'] });
        });
    }

};

module.exports = BuildingDataIntegration;
