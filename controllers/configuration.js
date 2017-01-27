/**
 * Configuration controller
 */

let Service = require('../model/services');

let configuration = {
    insertOrb: function(req, res, next) {
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
        }, req.cache, req.session).then(function() {
            next();
        });
    },

    updateOrb: function(req, res, next) {
        return Service.Configuration.createOrb({
            title: req.body.title,
            id: req.params.orbId,
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
        }, req.cache, req.session).then(function() {
            next();
        });
    },

    deleteOrb: function(req, res, next) {
        return Service.Configuration.deleteOrb(req.params.orbId, req.cache, req.session).then(function() {
            next();
        });
    },

    bulb: function(req, res, next) {
        return Service.Configuration.saveBulb({
            selector: req.body.selector,
            enabled: req.body.enabled,
            orb: req.body.orb
        }, req.cache, req.session).then(function() {
            next();
        });
    }

};

module.exports = configuration;
