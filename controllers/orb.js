/**
 * Dashboard controller
 */

let Service = require('../model/services');

let dashboard = {
    create: function(req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Orb.create({}, cache, resolve);
        });
    },

};

module.exports = dashboard;
