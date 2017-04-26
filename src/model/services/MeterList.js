/**
 * @overview Responsible for meter listing services
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition');


let MeterList = {
    /**
     * Retrieves the MeterList
     * @param  {Object} sess Session Object
     * @return {Promise} Resolves with list on success, reject on errors.
     */
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
        return Entity.Meter.collection().query('where', 'user_id', '=', client.coreUserID).fetch({
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
