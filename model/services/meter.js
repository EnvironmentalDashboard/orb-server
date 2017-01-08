/**
 * @overview Responsible for user authentication
 */

let Entity = require('../entities'),
    Recognition = require('./recognition');

let Meter = {

    initializeMeterList: function(reqCache, sess, done) {
        if (!Recognition.knowsClient(sess)) {
            reqCache.set('auth-error', true);
            return done();
        }

        new Entity.Meters().fetch({withRelated: ['building']}).then(function (results) {
            let meterList = {};

            results.forEach(function (meter) {
                if (!meterList[meter.relations.building.get('name')]) {
                    meterList[meter.relations.building.get('name')] = [];
                }

                meterList[meter.relations.building.get('name')].push({
                    name: meter.get('name'),
                    api: meter.get('url')
                });
            });

            reqCache.set('meter-list', meterList);
            return done();
        });
    }
};

module.exports = Meter;
