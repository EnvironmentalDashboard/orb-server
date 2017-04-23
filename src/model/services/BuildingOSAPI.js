/**
 * @overview •	Responsibilities include validating credentials & exchanging
 * access tokens.
 */
let requestPromise = require('request-promise-native');

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let urls = {
    authorize: 'https://api.buildingos.com/o/token/'
};

let BuildingOSAPI = {

    exchangeAccessCode: function(user, pass, id, secret) {
        let options = {
            method: 'POST',
            uri: urls.authorize,
            qs: {
                client_id: id,
                client_secret: secret,
                username: user,
                password: pass,
                grant_type: "password"
            },
            headers: {
                'User-Agent': 'node'
            },
            json: true
        };

        return requestPromise.post(options).then(function(body){
            return Promise.resolve(body.access_token);
        }).catch(function(err){
            return Promise.reject(err)
        });
    }

};

module.exports = BuildingOSAPI;
