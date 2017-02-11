/**
 * @overview Responsible for orb services
 */

 let Bookshelf = require('../components/bookshelf'),
     util = require('util');

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi');

let Bulb = {
    retrieveList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let bulbList = {},
            updatedClient;

        return new Entity.User({id: client.id}).fetch().then(function (user) {
            updatedClient = user;

            /**
             * If the client's token is empty/null then they haven't tried to
             * authorize their account with LifX
             */
            if (user.get('token') == null || user.get('token') === '') {
                return Promise.reject('This account isn\'t authroized with a LIFX account. Please authorize to link your accounts.');
            }

            return LifxBulbAPI.getBulbList(updatedClient.get('token')).catch(function() {
                return Promise.reject('The access token associated with your account went bad. Please reauthorize to link your accounts.');
            });

        }).then(function (bulbsFromAPI) {
            if(bulbsFromAPI) {
                JSON.parse(bulbsFromAPI).forEach(function (bulb) {
                    bulbList[bulb.id] = {info: bulb};
                });
            }

            return Entity.Bulb.collection().query('where', 'owner', '=', client.id).fetch({withRelated: ['orb']});
        }).then(function (bulbCollection) {

            if (bulbCollection) {
                bulbCollection.forEach(function (bulb) {
                    if(bulbList[bulb.get('selector')]) {
                        bulbList[bulb.get('selector')].config = bulb;
                    }
                });
            }

            return Promise.resolve(bulbList);
        });

    },

    save: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let errors = {};

        let selector = params.selector,
            enabled = params.enabled,
            orb = params.orb === "" ? null : params.orb;

        let bulbParams = {
                owner: client.id,
                selector: selector,
                enabled: enabled === "true",
                orb: orb
            },
            bulb = new Entity.Bulb(bulbParams);

        return bulb.validate().then(function (validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            if(orb == null || orb == "") {
                return Promise.resolve();
            }

            return new Entity.Orb({id: orb}).fetch();
        }).then(function (match) {
            if((match && match.get('owner') === client.id)
                || orb == null) {

                /**
                 * NOTICE: here we leak data mapper logic into the service layer
                 * because Knex.js and Bookshelf.js do not support upserts
                 */
                let query = util.format(`\
                    INSERT INTO \`%s\` (owner, enabled, orb, selector)
                        VALUES (:owner, :enabled, :orb, :selector)
                    ON DUPLICATE KEY UPDATE
                        enabled = :enabled,
                        orb = :orb,
                        owner = :owner
                `, bulb.tableName);

                return Bookshelf.knex.raw(query, bulbParams);

            }

            return Promise.resolve();
        })

    }
};

module.exports = Bulb;
