/**
 * Account controller
 */

let Service = require('../model/services');

let account = {
    register: function (req, cache) {
        return Service.Account.register({
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password1: req.body.password,
            password2: req.body.confirm
        }, cache);
    },

    update: function (req, cache) {
        return Service.Account.updateInformation({
            fname: req.body.fname,
            lname: req.body.lname
        }, cache, req.session);
    },

    updatePassword: function (req, cache) {
        return Service.Account.updatePassword({
            password: req.body.password,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirm
        }, cache, req.session);
    }

};

module.exports = account;
