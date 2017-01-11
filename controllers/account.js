/**
 * Account controller
 */

let Service = require('../model/services');

let account = {
    register: function(req, cache) {
        return Service.Account.register({
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password1: req.body.password,
            password2: req.body.confirm
        }, cache);
    },

};

module.exports = account;
