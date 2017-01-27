/**
 * Authentication controller
 */

let Service = require('../model/services');

let authentication = {
    signin: function (req, res, next) {
        return Service.Recognition.login({
            email: req.body.email,
            password: req.body.password
        }, req.cache, req.session).then(function() {
            next();
        });
    },

};

module.exports = authentication;
