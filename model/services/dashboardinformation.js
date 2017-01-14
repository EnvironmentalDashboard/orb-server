/**
 * @overview Responsible for dashboard services (dashboard generation)
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi'),
    Orb = require('./orb');


let DashboardInformation = {

    initializeOrbList: function(reqCache, sess) {
        client = Recognition.knowsClient(sess, reqCache);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        return Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function (results) {
            let orbList = [];

            results.forEach(function (orb) {
                orbList.push({
                    id: orb.get('id'),
                    title: orb.get('title')
                });
            });

            return orbList;
        }).then(function (list) {
            reqCache.set('orb-list', list);
            return Promise.resolve();
        });
    },

    initializeBulbList: function(reqCache, sess) {
        client = Recognition.knowsClient(sess, reqCache);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        let bulbCollectionPromise = Entity.Bulb.collection().query('where', 'owner', '=', client.id).fetch({withRelated: ['orb']}),
            bulbList = {};

        return bulbCollectionPromise.then(function (bulbCollection) {
            bulbCollection.forEach(function (bulb) {
                bulbList[bulb.get('selector')] = {info: null, config: bulb};
            });

            if (client.token == null || client.token === '') {
                reqCache.set('authorization-notice', 'This account isn\'t authorized with a LifX account. Please authorize to link your accounts.');
                return Promise.resolve({authorizationNotice: true});
            }
            return LifxBulbAPI.getBulbList(client.token);
        }).then(function (bulbsFromAPI) {
            if(bulbsFromAPI && !bulbsFromAPI.authorizationNotice) {
                JSON.parse(bulbsFromAPI).forEach(function (bulb) {
                    if(!bulbList[bulb.id]) {
                        bulbList[bulb.id] = {config: null};
                    }

                    bulbList[bulb.id].info = bulb;
                });
            }

            return Promise.resolve();
        }).catch(function(reason) {
            console.log(reason);
            reqCache.set('authorization-notice', 'The access token associated with your account went bad. Please reauthorize to link your accounts.');
            return Promise.resolve();
        });

    },

    initializeMeterList: function(reqCache, sess) {
        if (!Recognition.knowsClient(sess, reqCache)) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        return Entity.Meter.collection().fetch({withRelated: ['building']}).then(function (results) {
            let meterList = {};

            results.forEach(function (meter) {
                if (!meterList[meter.relations.building.get('name')]) {
                    meterList[meter.relations.building.get('name')] = [];
                }

                meterList[meter.relations.building.get('name')].push({
                    name: meter.get('name'),
                    id: meter.get('id')
                });
            });

            reqCache.set('meter-list', meterList);
            return Promise.resolve();
        });
    },

    initializeOrbInstructionsList: function(reqCache, sess) {
        if (!Recognition.knowsClient(sess, reqCache)) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        return Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function (orbs) {
            let relativeUsagePromises = [], keyToOrb = [], instructions = {};

            let now = +new Date();

            orbs.forEach(function (orb) {
                relativeUsagePromises.push(Orb.emulate(orb));

                keyToOrb.push(orb);
            });

            return Promise.all(relativeUsagePromises).then(function (instructionsReturned) {
                console.log(instructionsReturned);

                instructionsReturned.forEach(function(instruction, key){
                    instructions[ keyToOrb[key].get('id') ] = instruction;
                });

                return instructions;
            });

        }).then(function (list) {
            reqCache.set('orb-instruction-list', list);
            return Promise.resolve();
        });
    }
};

module.exports = DashboardInformation;
