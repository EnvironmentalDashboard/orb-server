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

        let user = params.user,
            pass = params.pass,
            id = params.id,
            secret = params.secret;

        return BuildingOSAPI.exchangeAccessCode(user, pass, id, secret).then(function(token) {
            /**
             * If the promise resolved then the credentials validate
             */

            let api = new Entity.API({
                'client_id': id,
                'client_secret': secret,
                'username': user,
                'password': pass,
                'token': token
            });

            return api.save();
        }).then(function(api) {
            let user = new Entity.CoreUser({
                'api_id': api.get('id'),
                'slug': 'environmental-orb-user-' + client.id + '-api-' + api.get('id'),
                'name': 'Environmental Orb User ' + client.id + ' API ' + api.get('id')
            });

            return user.save();
        });
    }

};

module.exports = BuildingDataIntegration;
