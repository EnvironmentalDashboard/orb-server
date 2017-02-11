/**
 * @overview Responsible for dashboard services (dashboard generation)
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi'),
    OrbEmulator = require('./orbemulator'),
    Orb = require('./orb');


let DashboardInformation = {
    getMeterList: function (sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
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

    getOrbInstructionsList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            console.log('rejected');

            return Promise.reject({
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
                relativeUsagePromises.push(OrbEmulator.emulate(orb, 1));
                relativeUsagePromises.push(OrbEmulator.emulate(orb, 2));

                keyToOrb.push({orb: orb, meter: 1});
                keyToOrb.push({orb: orb, meter: 2});
            });

            return Promise.all(relativeUsagePromises).then(function (instructionsReturned) {
                console.log('it resolved');
                instructionsReturned.forEach(function(instruction, key){
                    let orbId = keyToOrb[key].orb.get('id'),
                        meter = keyToOrb[key].meter;

                    if (!instructions[orbId]) {
                        instructions[orbId] = {meters: []};
                    }

                    instructions[orbId].meters[meter] = instruction;
                });

                return Promise.resolve(instructions);
            });

        }).then(function (list) {
            console.log('got here');
            console.log('instructions');
            return Promise.resolve(list);
        });
    }
};

module.exports = DashboardInformation;
