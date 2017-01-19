/**
 * Dashboard controller
 */

let Service = require('../model/services');

let dashboard = {
    orb: function(req, cache) {
        return Service.Configuration.createOrb({
            title: req.body.title,
            meter1: req.body.meter1,
            meter2: req.body.meter2,
            daySets: [
                /**
                 * If any of these values didn't come with the request, default
                 * them to 0. The CreateOrb service will not validate day sets
                 */
                req.body.day_0 || '0',
                req.body.day_1 || '0',
                req.body.day_2 || '0',
                req.body.day_3 || '0',
                req.body.day_4 || '0',
                req.body.day_5 || '0',
                req.body.day_6 || '0'
            ],
            sampleSize: req.body.sample
        }, req.session, cache);
    },

    bulb: function(req, cache) {
        return Service.Configuration.saveBulb({
            selector: req.body.selector,
            enabled: req.body.enabled,
            orb: req.body.orb
        }, req.session, cache);
    }

};

module.exports = dashboard;
