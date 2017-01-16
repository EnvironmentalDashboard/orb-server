/**
 * Dashboard controller
 */

let Service = require('../model/services');

let dashboard = {
    createOrb: function(req, cache) {
        return Service.Account.createOrb({
            title: req.body.title,
            meter1: req.body.meter1,
            meter2: req.body.meter2,
            daySets: [
                req.body.day_0,
                req.body.day_1,
                req.body.day_2,
                req.body.day_3,
                req.body.day_4,
                req.body.day_5,
                req.body.day_6
            ],
            sampleSize: req.body.sample
        }, req.session, cache);
    },

    updateBulb: function(req, cache) {
        return Service.Account.saveBulb({
            selector: req.body.selector,
            enabled: req.body.enabled,
            orb: req.body.orb
        }, req.session, cache);
    }

};

module.exports = dashboard;
