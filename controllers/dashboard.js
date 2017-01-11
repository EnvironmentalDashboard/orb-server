/**
 * Dashboard controller
 */

let Service = require('../model/services');

let dashboard = {
    createOrb: function(req, cache) {
        return Service.Account.createOrb({
                title: req.body.title,
                meter1: req.body.meter1,
                meter2: req.body.meter2
            }, req.session, cache);
    },

    updateBulb: function(req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Account.saveBulb({
                selector: req.body.selector,
                enabled: req.body.enabled,
                orb: req.body.orb
            }, req.session, cache, resolve);
        });
    }

};

module.exports = dashboard;
