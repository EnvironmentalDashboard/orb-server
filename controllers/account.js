/**
 * Account controller
 */

let Service = require('../model/services');

let account = {
    register: function (req, res, next) {
        return Service.Account.register({
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password1: req.body.password,
            password2: req.body.confirm
        }, req.cache).then(function() {
            next();
        });
    },

    update: function (req, res, next) {
        return Service.Account.updateInformation({
            fname: req.body.fname,
            lname: req.body.lname
        }, req.cache, req.session).then(function() {
            next();
        });
    },

    updatePassword: function (req, res, next) {
        return Service.Account.updatePassword({
            password: req.body.password,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirm
        }, req.cache, req.session).then(function() {
            next();
        });
    }

};

module.exports = account;
