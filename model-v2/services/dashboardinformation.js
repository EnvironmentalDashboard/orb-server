/**
 * @overview Responsible for dashboard services (dashboard generation)
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi'),
    Orb = require('./orb');


let DashboardInformation = {

    getOrbList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Proise.reject({
                authError: true
            });
        }

        let orbList = [];

        /**
         * Query for a collection of all orbs related to authenticated client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).orderBy('title').fetch({
            withRelated: ['meter1', 'meter2']
        }).then(function (results) {
            /**
             * Loop through each orb and store it in orbList
             */
            let meterPromises = [];

            results.forEach(function (orb) {
                let orbInfo = {id: orb.get('id'), title: orb.get('title')};

                meterPromises.push(orb.related('meter1').related('building').fetch().then(function (match) {
                    orbInfo.meter1 = {
                        building: match.get('name'),
                        name: orb.related('meter1').get('name')
                    };

                    return orb.related('meter2').related('building').fetch();
                }).then(function (match) {
                    orbInfo.meter2 = {
                        building: match.get('name'),
                        name: orb.related('meter2').get('name')
                    };

                    return true;
                }));

                orbList.push(orbInfo);
            });

            return Promise.all(meterPromises);
        }).then(function() {
            return Promise.resolve(orbList);
        });
    },

    getOrb: function(orbId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Proise.reject({
                authError: true
            });
        }

        return new Entity.Orb({
            id: orbId,
            owner: client.id
        }).fetch().then(function (orb) {
            if(!orb) {
                return Promise.reject('Records don\'t exist for the targetted orb');
            }

            return Promise.resolve(orb.attributes);
        });
    },

    getBulbList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Proise.reject({
                authError: true
            });
        }

        let bulbList = {}, updatedClient;

        return new Entity.User({id: client.id}).fetch().then(function (user) {
            updatedClient = user;

            /**
             * If the client's token is empty/null then they haven't tried to
             * authorize their account with LifX
             */
            if (user.get('token') == null || user.get('token') === '') {
                return Promise.reject('This account isn\'t authroized with a LIFX account. Please authorize to link your accounts.');
            }

            return LifxBulbAPI.getBulbList(updatedClient.get('token'));
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

            for (var key in bulbList) {
                let bulb = bulbList[key];

                if(bulb.info && (bulb.info.label.substring(0,4) === "LIFX"
                    || bulb.info.group.name === "My Room"
                    || bulb.info.location.name === "My Group")) {
                    bulbList.labellingNotice = true;

                    break;
                }
            }

            return Promise.resolve(bulbList);
        }).catch(function(reason) {
            /**
             * If there was an exception, set a generic authorization notice &
             * resolve
             */
            console.log(reason);
            return Promise.reject('authorization-notice', 'The access token associated with your account went bad. Please reauthorize to link your accounts.');
        });

    },

    getMeterList: function (sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Proise.reject({
                authError: true
            });
        }

        /**
         * Get all the meters in the database
         */
        return Entity.Meter.collection().fetch({withRelated: ['building']}).then(function (results) {
            let meterList = {};

            results.forEach(function (meter) {
                /**
                 * Assign meters to the meter list with the building name as the
                 * key
                 */
                if (!meterList[meter.relations.building.get('name')]) {
                    meterList[meter.relations.building.get('name')] = [];
                }

                meterList[meter.relations.building.get('name')].push({
                    name: meter.get('name'),
                    id: meter.get('bos_uuid')
                });
            });

            return Promise.resolve(meterList);
        });
    },

    initializeOrbInstructionsList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Proise.reject({
                authError: true
            });
        }

        /**
         * Query for a collection of all orbs associated with the recognized
         * client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function (orbs) {
            /**
             * Stores promises of relative usage calculation
             * @type {Array}
             */
            let relativeUsagePromises = [];

            /**
             * Associates an orb and meter with entries w/ same key in
             * `relativeUsagePromises`
             * @type {Array}
             */
            let keyToOrb = [];

            let instructions = {};

            orbs.forEach(function (orb) {
                relativeUsagePromises.push(Orb.emulate(orb, 1));
                relativeUsagePromises.push(Orb.emulate(orb, 2));

                keyToOrb.push({orb: orb, meter: 1});
                keyToOrb.push({orb: orb, meter: 2});
            });

            return Promise.all(relativeUsagePromises).then(function (instructionsReturned) {
                instructionsReturned.forEach(function(instruction, key){
                    let orbId = keyToOrb[key].orb.get('id'),
                        meter = keyToOrb[key].meter;

                    if (!instructions[orbId]) {
                        instructions[orbId] = {meters: []};
                    }

                    instructions[orbId].meters[meter] = instruction;
                });

                return instructions;
            });

        }).then(function (list) {
            return Promise.resolve(list);
        });
    }
};

module.exports = DashboardInformation;
