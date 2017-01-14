/**
 * Page controller
 */

let Service = require('../model/services');

let page = {
    index: function (req, cache) {
        return Promise.resolve();
    },

    signin: function (req, cache) {
        return Promise.resolve();
    },

    signup: function (req, cache) {
        return Promise.resolve();
    },

    signupSuccess: function (req, cache) {
        return Promise.resolve();
    },

    dashboard: function (req, cache) {
        return Service.DashboardInformation.initializeOrbList(cache, req.session).then(function () {
            return Service.DashboardInformation.initializeBulbList(cache, req.session);
        });
    },

    neworb: function (req, cache) {
        return Service.DashboardInformation.initializeMeterList(cache, req.session);
    },

    orbSuccess: function (req, cache) {
        Service.Recognition.knowsClient(req.session, cache);

        return Promise.resolve();
    },

    authConfirm: function (req, cache) {
        return Promise.resolve();
    },

    guide: function (req, cache) {
        Service.Recognition.knowsClient(req.session, cache);

        return Promise.resolve();
    }
};

module.exports = page;
