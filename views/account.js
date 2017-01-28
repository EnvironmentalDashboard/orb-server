/**
 * Account view
 */

let base = require('./base');

let account = {
    register: function (req, res, next) {

        req.cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the registration page again
             */
            if (val !== undefined) {
                res.render('register', {
                    active: {signup: true},
                    loggedIn: req.cache.get('loggedIn'),
                    errors: val,
                    form: req.cache.get('form')
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/signup/success');
            }
        });

    },

    update: function (req, res, next) {
        req.cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the config page again
             */
            if (val !== undefined) {

                res.render('account-config', {
                    active: {account: true},
                    loggedIn: req.cache.get('loggedIn'),
                    errors: val,
                    form: req.cache.get('form')
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/config/success');
            }
        });

    },

    updatePassword: function (req, res, next) {
        req.cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the config page again
             */
            if (val !== undefined) {
                res.render('account-password-config', {
                    active: {account: true},
                    loggedIn: req.cache.get('loggedIn'),
                    errors: val
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/config/success');
            }
        });

    }

};

module.exports = account;
