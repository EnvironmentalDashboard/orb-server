/**
 * @overview Responsible for meter services
 */

let Entity = require('../entities'),
    Recognition = require('./recognition');

let Meter = {

    initializeMeterList: function(reqCache, sess, done) {
        if (!Recognition.knowsClient(sess)) {
            reqCache.set('auth-error', true);
            return done();
        }

        Entity.Meter.collection().fetch({withRelated: ['building']}).then(function (results) {
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
            return done();
        });
    }
};

module.exports = Meter;
