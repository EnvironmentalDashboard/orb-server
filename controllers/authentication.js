/**
 * Authentication controller
 */

let Service = require('../model/services');

let authentication = {
    signin: function (req, cache) {
        return Service.Recognition.login({
            email: req.body.email,
            password: req.body.password
        }, cache, req.session);
    },

};

module.exports = authentication;
