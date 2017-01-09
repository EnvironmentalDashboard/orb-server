/**
 * Dashboard controller
 */

let Service = require('../model/services');

let dashboard = {
    createOrb: function(req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Orb.create({
                title: req.body.title,
                meter1: req.body.meter1,
                meter2: req.body.meter2
            }, req.session, cache, resolve);
        });
    },

    updateBulb: function(req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Bulb.save({
                selector: req.body.selector,
                enabled: req.body.enabled,
                orb: req.body.orb
            }, req.session, cache, resolve);
        });
    }

};

module.exports = dashboard;
