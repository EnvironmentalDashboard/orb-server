/**
 * @overview Responsible for dashboard services (dashboard generation)
 *
 * @todo Do something with this (turn it into Meter service, possibly)
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi'),
    OrbEmulator = require('./orbemulator'),
    Orb = require('./orb');


let DashboardInformation = {
    getMeterList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        /**
         * Get all the meters in the database
         */
        return Entity.Meter.collection().fetch({
            withRelated: ['building']
        }).then(function(results) {
            let meterList = {};

            results.forEach(function(meter) {
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
    }
};

module.exports = DashboardInformation;
