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
        if(base.caughtAuthError(req.cache)) {
            return res.render('denied');
        }

        req.cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the config page again
             */
            if (val !== undefined) {

                res.render('account-config', {
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
        if(base.caughtAuthError(req.cache)) {
            return res.render('denied');
        }

        req.cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the config page again
             */
            if (val !== undefined) {
                res.render('account-password-config', {
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
