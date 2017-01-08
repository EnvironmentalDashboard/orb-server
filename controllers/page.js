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
        return new Promise(function (resolve, reject){
            Service.Dashboard.initializeDashboard(cache, req.session, resolve);
        });
    },

    neworb: function(req, cache) {
        return new Promise(function (resolve, reject){
            Service.Meter.initializeMeterList(cache, req.session, resolve);
        });
    },

    orbSuccess: function(req, cache) {
        return new Promise(function (resolve, reject){
            resolve();
        });
    }
};

module.exports = page;
