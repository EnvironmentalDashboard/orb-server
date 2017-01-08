/**
 * Authentication controller
 */

let Service = require('../model/services');

let authentication = {
    signin: function (req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Recognition.login({
                email: req.body.email,
                password: req.body.password
            }, cache, req.session, resolve);
        });
    },

};

module.exports = authentication;
