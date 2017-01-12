/**
 * Page controller
 */

let Service = require('../model/services');

let page = {
    index: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    },

    signin: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    },

    signup: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    },

    signupSuccess: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    },

    dashboard: function(req, cache) {
        return Service.DashboardInformation.initializeOrbList(cache, req.session).then(function() {
            return Service.DashboardInformation.initializeBulbList(cache, req.session);
        });
    },

    neworb: function(req, cache) {
        return Service.DashboardInformation.initializeMeterList(cache, req.session);
    },

    orbSuccess: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    },

    authConfirm: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    }
};

module.exports = page;
