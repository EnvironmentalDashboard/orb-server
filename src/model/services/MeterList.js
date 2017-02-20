/**
 * @overview Responsible for meter listing services
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    LifxBulbAPI = require('./LifxBulbAPI'),
    OrbEmulator = require('./OrbEmulator'),
    Orb = require('./Orb');


let MeterList = {
    retrieve: function(sess) {
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

module.exports = MeterList;
