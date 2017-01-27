/**
 * Page controller
 */

let Service = require('../model/services');

let page = {
    index: function (req, res, next) {
        return next();
    },

    signin: function (req, res, next) {
        return next();
    },

    signup: function (req, res, next) {
        return next();
    },

    signupSuccess: function (req, res, next) {
        return next();
    },

    dashboard: function (req, res, next) {
        return Promise.all([
            Service.DashboardInformation.initializeOrbList(req.cache, req.session),
            Service.DashboardInformation.initializeBulbList(req.cache, req.session)
        ]).then(function() {
            next();
        });
    },

    newOrb: function (req, res, next) {
        return Service.DashboardInformation.initializeMeterList(req.cache, req.session)
            .then(function() {
                next();
            });
    },

    editOrb: function (req, res, next) {
        return Promise.all([
            Service.DashboardInformation.initializeOrb(req.params.orbId, req.cache, req.session),
            Service.DashboardInformation.initializeMeterList(req.cache, req.session)
        ]).then(function() {
            next();
        });
    },

    deleteOrb: function(req, res, next) {
        return Service.DashboardInformation.initializeOrb(req.params.orbId, req.cache, req.session)
            .then(function() {
                next();
            });
    },

    orbSuccess: function (req, res, next) {
        return next();
    },

    authConfirm: function (req, res, next) {
        return next();
    },

    guide: function (req, res, next) {
        return next();
    },

    account: function (req, res, next) {
        return next();
    },

    accountConfig: function (req, res, next) {
        return next();
    },

    accountConfigSuccess: function (req, res, next) {
        Service.Recognition.refreshClient(req.cache, req.session)
            .then(function() {
                next();
            });
    },

    securityConfig: function (req, res, next) {
        return next();
    }
};

module.exports = page;
